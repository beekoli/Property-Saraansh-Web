<?php
/**
 * Plugin Name: Property Saraansh Core
 * Description: Registers the Properties custom post type and Advanced Custom Fields for the Next.js frontend.
 * Version: 1.3.0
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
