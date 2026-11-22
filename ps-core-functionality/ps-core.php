<?php
/**
 * Plugin Name: Property Saraansh Core
 * Description: Registers the Properties custom post type and Advanced Custom Fields for the Next.js frontend.
 * Version: 1.5.0
 * Author: Property Saraansh
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * 1. Register Custom Post Type: Properties
 */
if (!function_exists('ps_register_properties_cpt')) {
    function ps_register_properties_cpt() {
        $labels = array(
            'name'                  => 'Properties',
            'singular_name'         => 'Property',
            'menu_name'             => 'Properties',
            'name_admin_bar'        => 'Property',
            'add_new'               => 'Add New',
            'add_new_item'          => 'Add New Property',
            'new_item'              => 'New Property',
            'edit_item'             => 'Edit Property',
            'view_item'             => 'View Property',
            'all_items'             => 'All Properties',
            'search_items'          => 'Search Properties',
            'not_found'             => 'No properties found.',
            'not_found_in_trash'    => 'No properties found in Trash.'
        );

        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'properties'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => 5,
            'menu_icon'          => 'dashicons-building',
            'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
            'show_in_rest'       => true,
        );

        register_post_type('properties', $args);
    }
}
add_action('init', 'ps_register_properties_cpt');

/**
 * 2. Register Advanced Custom Fields (ACF)
 *
 * NOTE (2026-07-07 cleanup): the old flat "Property Details" field group
 * (group_properties_details) has been removed. Property content now uses the
 * v2 SCF field group (managed directly in wp-admin) plus the ps_ taxonomies
 * (ps_property_type, ps_location, ps_builder, ps_project_status). Only the
 * blog video_id group and the Builder Profile group are registered in code.
 */
if (!function_exists('ps_register_acf_fields')) {
    function ps_register_acf_fields() {
        if (function_exists('acf_add_local_field_group')):

            // Register video ID field group for standard posts (blog articles)
            acf_add_local_field_group(array(
                'key' => 'group_blog_post_details',
                'title' => 'Blog Post Details',
                'fields' => array(
                    array(
                        'key' => 'field_blog_video_id',
                        'label' => 'YouTube Video ID',
                        'name' => 'video_id',
                        'type' => 'text',
                        'show_in_rest' => true,
                        'description' => 'Enter YouTube Video ID (e.g., e-WJp9zY7o8) to display a related video guide in the blog article.',
                    ),
                ),
                'location' => array(
                    array(
                        array(
                            'param' => 'post_type',
                            'operator' => '==',
                            'value' => 'post',
                        ),
                    ),
                ),
                'show_in_rest' => true,
            ));

            // Register builder profile field group for the "builder" taxonomy term
            // (created via Custom Post Type UI, attached to the Properties CPT,
            // internal taxonomy slug is "ps_builder" — its REST base alias is "builder").
            acf_add_local_field_group(array(
                'key' => 'group_builder_profile',
                'title' => 'Builder Profile',
                'fields' => array(
                    array(
                        'key' => 'field_builder_logo',
                        'label' => 'Builder Logo',
                        'name' => 'builder_logo',
                        'type' => 'image',
                        'return_format' => 'url',
                        'show_in_rest' => true,
                    ),
                    array(
                        'key' => 'field_builder_description',
                        'label' => 'About the Builder',
                        'name' => 'builder_description',
                        'type' => 'textarea',
                        'show_in_rest' => true,
                    ),
                    array(
                        'key' => 'field_builder_experience',
                        'label' => 'Experience (e.g. 40+ Years)',
                        'name' => 'builder_experience',
                        'type' => 'text',
                        'show_in_rest' => true,
                    ),
                    array(
                        'key' => 'field_builder_delivered_projects',
                        'label' => 'Projects Delivered (e.g. 200+)',
                        'name' => 'builder_delivered_projects',
                        'type' => 'text',
                        'show_in_rest' => true,
                    ),
                    array(
                        'key' => 'field_builder_ongoing_projects',
                        'label' => 'Ongoing Projects (e.g. 25)',
                        'name' => 'builder_ongoing_projects',
                        'type' => 'text',
                        'show_in_rest' => true,
                    ),
                ),
                'location' => array(
                    array(
                        array(
                            'param' => 'taxonomy',
                            'operator' => '==',
                            'value' => 'ps_builder',
                        ),
                    ),
                ),
                'show_in_rest' => true,
            ));

        endif;
    }
}
add_action('acf/init', 'ps_register_acf_fields');

// Ensure ACF to REST API formatting is active
add_filter('acf/settings/rest_api_format', function () {
    return 'standard';
});

/**
 * 3. Native Gallery Meta Box
 */
if (!function_exists('ps_gallery_admin_scripts')) {
    function ps_gallery_admin_scripts() {
        global $typenow;
        if ($typenow == 'properties') {
            wp_enqueue_media();
            wp_enqueue_script('ps-gallery-script', false); // Dummy script to add inline
            wp_add_inline_script('ps-gallery-script', '
                jQuery(document).ready(function($){
                    var meta_image_frame;
                    $("#ps_gallery_button").click(function(e){
                        e.preventDefault();
                        if ( meta_image_frame ) {
                            meta_image_frame.open();
                            return;
                        }
                        meta_image_frame = wp.media.frames.file_frame = wp.media({
                            title: "Select or Upload Gallery Images",
                            button: { text: "Use these images" },
                            multiple: true
                        });
                        meta_image_frame.on("select", function() {
                            var selection = meta_image_frame.state().get("selection");
                            var ids = [], urls = [];
                            selection.map(function(attachment) {
                                attachment = attachment.toJSON();
                                ids.push(attachment.id);
                                urls.push(attachment.url);
                            });
                            $("#ps_gallery_ids").val(ids.join(","));
                            var html = "";
                            for(var i=0; i<urls.length; i++) {
                                html += "<img src=\'"+urls[i]+"\' style=\'max-width:100px; height:auto; margin:5px; border:1px solid #ccc;\' />";
                            }
                            $("#ps_gallery_preview").html(html);
                        });
                        meta_image_frame.open();
                    });

                    $("#ps_gallery_clear").click(function(e) {
                        e.preventDefault();
                        $("#ps_gallery_ids").val("");
                        $("#ps_gallery_preview").html("");
                    });
                });
            ');
        }
    }
}
add_action('admin_enqueue_scripts', 'ps_gallery_admin_scripts');

if (!function_exists('ps_add_gallery_meta_box')) {
    function ps_add_gallery_meta_box() {
        add_meta_box(
            'ps_gallery_meta_box',
            'Property Gallery',
            'ps_render_gallery_meta_box',
            'properties',
            'normal',
            'high'
        );
    }
}
add_action('add_meta_boxes', 'ps_add_gallery_meta_box');

if (!function_exists('ps_render_gallery_meta_box')) {
    function ps_render_gallery_meta_box($post) {
        wp_nonce_field('ps_save_gallery_meta_box', 'ps_gallery_meta_box_nonce');
        $gallery_ids = get_post_meta($post->ID, '_property_gallery_ids', true);

        echo '<p><button id="ps_gallery_button" class="button button-primary">Manage Gallery</button> <button id="ps_gallery_clear" class="button">Clear Gallery</button></p>';
        echo '<input type="hidden" id="ps_gallery_ids" name="ps_gallery_ids" value="' . esc_attr($gallery_ids) . '" />';

        echo '<div id="ps_gallery_preview" style="display:flex; flex-wrap:wrap; margin-top:10px;">';
        if (!empty($gallery_ids)) {
            $ids = explode(',', $gallery_ids);
            foreach ($ids as $id) {
                $url = wp_get_attachment_url($id);
                if ($url) {
                    echo '<img src="' . esc_url($url) . '" style="max-width:100px; height:auto; margin:5px; border:1px solid #ccc;" />';
                }
            }
        }
        echo '</div>';
    }
}

if (!function_exists('ps_save_gallery_meta_box')) {
    function ps_save_gallery_meta_box($post_id) {
        if (!isset($_POST['ps_gallery_meta_box_nonce'])) return;
        if (!wp_verify_nonce($_POST['ps_gallery_meta_box_nonce'], 'ps_save_gallery_meta_box')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;

        if (isset($_POST['ps_gallery_ids'])) {
            update_post_meta($post_id, '_property_gallery_ids', sanitize_text_field($_POST['ps_gallery_ids']));
        }
    }
}
add_action('save_post', 'ps_save_gallery_meta_box');

/**
 * 4. Expose Gallery to REST API
 */
add_action('rest_api_init', function () {
    register_rest_field('properties', 'property_gallery', array(
        'get_callback' => function ($post_arr) {
            $gallery_ids = get_post_meta($post_arr['id'], '_property_gallery_ids', true);
            $urls = array();
            if (!empty($gallery_ids)) {
                $ids = explode(',', $gallery_ids);
                foreach ($ids as $id) {
                    $url = wp_get_attachment_url($id);
                    if ($url) {
                        $urls[] = $url;
                    }
                }
            }
            return $urls;
        },
        'schema' => null,
    ));
});

/**
 * 5. Expose Rank Math's per-post SEO fields to the REST API.
 *
 * Rank Math keeps the SEO title, meta description and focus keyword in post
 * meta, but does not register those keys for REST. WordPress silently drops
 * writes to unregistered meta keys, so anything posting them through /wp-json
 * — notably scripts/news-to-wp/create-news-drafts.js, which sends
 * meta.rank_math_title / rank_math_description / rank_math_focus_keyword —
 * appeared to succeed while the values were discarded.
 *
 * That is why script-created news posts had an empty SEO title (the frontend
 * then fell back to "<post title> | Property Saraansh") while hand-edited posts
 * carried the copy written in the Rank Math box. Registering the keys makes
 * them both readable and writable over REST.
 */
if (!function_exists('ps_register_rank_math_meta')) {
    function ps_register_rank_math_meta() {
        $keys = array(
            'rank_math_title',
            'rank_math_description',
            'rank_math_focus_keyword',
        );

        // 'page' and 'ps_video' were added when page-level copy and meta moved
        // to WordPress: the frontend reads meta.rank_math_title /
        // rank_math_description off the Page whose slug matches the route
        // (e.g. the "our-videos" Page drives /our-videos), and WordPress only
        // returns meta keys over REST once they are registered here.
        foreach (array('post', 'page', 'properties', 'ps_video') as $post_type) {
            foreach ($keys as $key) {
                register_post_meta($post_type, $key, array(
                    'type'          => 'string',
                    'single'        => true,
                    'default'       => '',
                    'show_in_rest'  => true,
                    'auth_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                ));
            }
        }
    }
    add_action('init', 'ps_register_rank_math_meta');
}

/**
 * 9. Keep the headless WordPress backend out of search engines.
 *
 * The public site is the Next.js frontend on www.propertysaraansh.com. This
 * WordPress install only feeds it over REST, so none of its URLs (pages, tags,
 * /wp-json, media files) should ever be indexed.
 *
 * robots.txt used to say "Disallow: /". That stops Google crawling, but it also
 * stops Google seeing a noindex, so URLs it found through links stayed in the
 * index as "Indexed, though blocked by robots.txt". Instead every response now
 * carries X-Robots-Tag: noindex and robots.txt allows crawling, so Google can
 * read the noindex and drop the URLs. The frontend's REST calls are unaffected.
 */
if (!function_exists('ps_noindex_backend')) {
    define('PS_NOINDEX_VALUE', 'noindex, nofollow, noarchive');

    // HTML responses: header + meta robots.
    function ps_noindex_backend() {
        if (!headers_sent()) {
            header('X-Robots-Tag: ' . PS_NOINDEX_VALUE, true);
        }
    }
    add_action('send_headers', 'ps_noindex_backend');
    add_action('login_init', 'ps_noindex_backend');
    add_action('admin_init', 'ps_noindex_backend');
    add_filter('wp_robots', function ($robots) {
        $robots['noindex']  = true;
        $robots['nofollow'] = true;
        return $robots;
    }, 99);

    // REST API responses (/wp-json/...).
    add_filter('rest_post_dispatch', function ($response) {
        if ($response instanceof WP_REST_Response) {
            $response->header('X-Robots-Tag', PS_NOINDEX_VALUE);
        }
        return $response;
    }, 99);

    // Let crawlers in so they can see the noindex. Runs after Rank Math and
    // the "Discourage search engines" setting, which both write robots.txt.
    add_filter('robots_txt', function () {
        return "# Headless WordPress backend. Every URL here is noindex.\n"
            . "# The public site is https://www.propertysaraansh.com\n"
            . "User-agent: *\nAllow: /\n";
    }, 999);

    // Stop advertising backend URLs in page heads and HTTP headers.
    remove_action('wp_head', 'rest_output_link_wp_head', 10);
    remove_action('template_redirect', 'rest_output_link_header', 11);
    remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_shortlink_wp_head', 10);
    remove_action('template_redirect', 'wp_shortlink_header', 11);
    add_filter('xmlrpc_enabled', '__return_false');

    // The core WordPress sitemap would list every backend URL.
    add_filter('wp_sitemaps_enabled', '__return_false');

    // Media files (images, PDFs) are served by the web server without PHP, so
    // the header has to come from .htaccess. Written once per plugin version.
    function ps_noindex_htaccess_lines() {
        return array(
            '<IfModule mod_headers.c>',
            'Header always set X-Robots-Tag "' . PS_NOINDEX_VALUE . '"',
            '</IfModule>',
        );
    }
    add_action('admin_init', function () {
        if (get_option('ps_noindex_htaccess_version') === '1.5.0') {
            return;
        }
        if (!function_exists('insert_with_markers')) {
            require_once ABSPATH . 'wp-admin/includes/misc.php';
        }
        $htaccess = ABSPATH . '.htaccess';
        if ((file_exists($htaccess) && is_writable($htaccess)) || (!file_exists($htaccess) && is_writable(ABSPATH))) {
            if (insert_with_markers($htaccess, 'PS Noindex Backend', ps_noindex_htaccess_lines())) {
                update_option('ps_noindex_htaccess_version', '1.5.0');
            }
        }
    });
    register_deactivation_hook(__FILE__, function () {
        if (!function_exists('insert_with_markers')) {
            require_once ABSPATH . 'wp-admin/includes/misc.php';
        }
        insert_with_markers(ABSPATH . '.htaccess', 'PS Noindex Backend', array());
        delete_option('ps_noindex_htaccess_version');
    });
}

/**
 * 10. A static robots.txt in the web root ("User-agent: * / Disallow: /",
 * added 2026-07-05) overrides WordPress's virtual robots.txt, so the Allow in
 * section 9 never reached crawlers. Move it aside once — renamed, not deleted,
 * so it can be restored by renaming robots.txt.ps-backup back.
 */
if (!function_exists('ps_retire_static_robots')) {
    function ps_retire_static_robots() {
        if (get_option('ps_static_robots_retired')) {
            return;
        }
        $file = ABSPATH . 'robots.txt';
        if (file_exists($file)) {
            $body = trim(str_replace("\r", '', (string) file_get_contents($file)));
            if (preg_match('/^User-agent:\s*\*\s*\nDisallow:\s*\/$/i', $body) && is_writable(ABSPATH)) {
                if (!@rename($file, ABSPATH . 'robots.txt.ps-backup')) {
                    return;
                }
            } else {
                // Unexpected content: leave it for a human to look at.
                return;
            }
        }
        update_option('ps_static_robots_retired', 1);
    }
    add_action('admin_init', 'ps_retire_static_robots');
}
