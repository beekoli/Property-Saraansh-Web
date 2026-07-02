<?php
/**
 * Plugin Name: Property Saraansh Core
 * Description: Registers the Properties custom post type and Advanced Custom Fields for the Next.js frontend.
 * Version: 1.1.1
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
 */
if (!function_exists('ps_register_acf_fields')) {
    function ps_register_acf_fields() {
        if (function_exists('acf_add_local_field_group')):

            $property_fields = array(
                // --- Core Details ---
                array('key' => 'field_prop_price', 'label' => 'Price', 'name' => 'price', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_location', 'label' => 'Location', 'name' => 'location', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_type', 'label' => 'Property Type', 'name' => 'property_type', 'type' => 'select', 'choices' => array('Commercial' => 'Commercial', 'Residential' => 'Residential', 'Ultra Luxury' => 'Ultra Luxury'), 'show_in_rest' => true),
                array('key' => 'field_prop_developer', 'label' => 'Developer', 'name' => 'developer', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_project_logo', 'label' => 'Project Logo', 'name' => 'project_logo', 'type' => 'image', 'return_format' => 'url', 'show_in_rest' => true),
                array('key' => 'field_prop_developer_description', 'label' => 'Developer Description', 'name' => 'developer_description', 'type' => 'textarea', 'show_in_rest' => true),
                array('key' => 'field_prop_developer_experience', 'label' => 'Developer Experience (e.g. 15 Years)', 'name' => 'developer_experience', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_developer_delivered_projects', 'label' => 'Developer Delivered Projects (e.g. 50+)', 'name' => 'developer_delivered_projects', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_developer_ongoing_projects', 'label' => 'Developer Ongoing Projects (e.g. 10+)', 'name' => 'developer_ongoing_projects', 'type' => 'text', 'show_in_rest' => true),
                
                // --- Overview Section ---
                array('key' => 'field_prop_project_overview', 'label' => 'Project Overview Description', 'name' => 'project_overview', 'type' => 'textarea', 'show_in_rest' => true),
                array('key' => 'field_prop_total_land', 'label' => 'Total Land', 'name' => 'total_land', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_rera', 'label' => 'RERA Number', 'name' => 'rera_number', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_config', 'label' => 'Configuration', 'name' => 'configuration', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_total_units', 'label' => 'Total Units', 'name' => 'total_units', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_possession', 'label' => 'Possession Date', 'name' => 'possession_date', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_launch_date', 'label' => 'Launch Date', 'name' => 'launch_date', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_total_floors', 'label' => 'Total Floors', 'name' => 'total_floors', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_units_per_floor', 'label' => 'Units Per Floor', 'name' => 'units_per_floor', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_lifts_per_floor', 'label' => 'Lifts Per Floor', 'name' => 'lifts_per_floor', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_base_price', 'label' => 'Base Price (e.g. ₹ 12,000 / sq.ft)', 'name' => 'base_price', 'type' => 'text', 'show_in_rest' => true),
                
                // --- Interactive Video Review ---
                array('key' => 'field_prop_video_id', 'label' => 'YouTube Video ID', 'name' => 'video_id', 'type' => 'text', 'show_in_rest' => true),
                array('key' => 'field_prop_video_review_text', 'label' => 'Video Review Quote/Text', 'name' => 'video_review_text', 'type' => 'textarea', 'show_in_rest' => true),
                
                // --- Extra Info & Media ---
                array('key' => 'field_prop_price_desc', 'label' => 'Price List Description', 'name' => 'price_list_desc', 'type' => 'wysiwyg', 'show_in_rest' => true),
                array('key' => 'field_prop_highlights', 'label' => 'Highlights (separated by semicolons \';\')', 'name' => 'highlights', 'type' => 'textarea', 'show_in_rest' => true),
                array('key' => 'field_prop_loc_adv', 'label' => 'Location Advantages', 'name' => 'location_advantages', 'type' => 'wysiwyg', 'show_in_rest' => true),
                array('key' => 'field_prop_map_embed', 'label' => 'Google Map Embed URL / IFrame Source', 'name' => 'google_map_embed', 'type' => 'textarea', 'show_in_rest' => true),
            );

            // --- Amenities (1 to 12 slots) ---
            for ($i = 1; $i <= 12; $i++) {
                $property_fields[] = array(
                    'key' => 'field_prop_amenity_' . $i . '_icon',
                    'label' => 'Amenity ' . $i . ' Icon',
                    'name' => 'amenity_' . $i . '_icon',
                    'type' => 'image',
                    'return_format' => 'url',
                    'show_in_rest' => true,
                );
                $property_fields[] = array(
                    'key' => 'field_prop_amenity_' . $i . '_name',
                    'label' => 'Amenity ' . $i . ' Name',
                    'name' => 'amenity_' . $i . '_name',
                    'type' => 'text',
                    'show_in_rest' => true,
                );
            }
            // --- Site Plan ---
            $property_fields[] = array(
                'key' => 'field_prop_site_plan_image',
                'label' => 'Site Plan Image',
                'name' => 'site_plan_image',
                'type' => 'image',
                'return_format' => 'url',
                'show_in_rest' => true,
            );

            // --- Floor Plans (1 to 4 slots) ---
            for ($i = 1; $i <= 4; $i++) {
                $property_fields[] = array(
                    'key' => 'field_prop_floor_' . $i . '_title',
                    'label' => 'Floor Plan ' . $i . ' Title',
                    'name' => 'floor_plan_' . $i . '_title',
                    'type' => 'text',
                    'show_in_rest' => true,
                );
                $property_fields[] = array(
                    'key' => 'field_prop_floor_' . $i . '_desc',
                    'label' => 'Floor Plan ' . $i . ' Description',
                    'name' => 'floor_plan_' . $i . '_desc',
                    'type' => 'textarea',
                    'show_in_rest' => true,
                );
                $property_fields[] = array(
                    'key' => 'field_prop_floor_' . $i . '_image',
                    'label' => 'Floor Plan ' . $i . ' Image',
                    'name' => 'floor_plan_' . $i . '_image',
                    'type' => 'image',
                    'return_format' => 'url',
                    'show_in_rest' => true,
                );
            }

            // --- Floor Plans Footer Text ---
            $property_fields[] = array(
                'key' => 'field_prop_floor_plan_footer_text',
                'label' => 'Floor Plan Footer Text',
                'name' => 'floor_plan_footer_text',
                'type' => 'textarea',
                'show_in_rest' => true,
            );

            // --- Price List (1 to 4 rows) ---
            for ($i = 1; $i <= 4; $i++) {
                $property_fields[] = array(
                    'key' => 'field_prop_price_row_' . $i . '_type',
                    'label' => 'Price List Row ' . $i . ' Type',
                    'name' => 'price_list_row_' . $i . '_type',
                    'type' => 'text',
                    'show_in_rest' => true,
                );
                $property_fields[] = array(
                    'key' => 'field_prop_price_row_' . $i . '_size',
                    'label' => 'Price List Row ' . $i . ' Size',
                    'name' => 'price_list_row_' . $i . '_size',
                    'type' => 'text',
                    'show_in_rest' => true,
                );
                $property_fields[] = array(
                    'key' => 'field_prop_price_row_' . $i . '_base',
                    'label' => 'Price List Row ' . $i . ' Base Price',
                    'name' => 'price_list_row_' . $i . '_base',
                    'type' => 'text',
                    'show_in_rest' => true,
                );
                $property_fields[] = array(
                    'key' => 'field_prop_price_row_' . $i . '_total',
                    'label' => 'Price List Row ' . $i . ' Total Price',
                    'name' => 'price_list_row_' . $i . '_total',
                    'type' => 'text',
                    'show_in_rest' => true,
                );
            }

            // --- FAQs (1 to 5 slots) ---
            for ($i = 1; $i <= 5; $i++) {
                $property_fields[] = array(
                    'key' => 'field_prop_faq_' . $i . '_question',
                    'label' => 'FAQ ' . $i . ' Question',
                    'name' => 'faq_' . $i . '_question',
                    'type' => 'text',
                    'show_in_rest' => true,
                );
                $property_fields[] = array(
                    'key' => 'field_prop_faq_' . $i . '_answer',
                    'label' => 'FAQ ' . $i . ' Answer',
                    'name' => 'faq_' . $i . '_answer',
                    'type' => 'textarea',
                    'show_in_rest' => true,
                );
            }

            // --- Gallery (1 to 10 slots) ---
            for ($i = 1; $i <= 10; $i++) {
                $property_fields[] = array(
                    'key' => 'field_prop_gallery_' . $i,
                    'label' => 'Gallery Image ' . $i,
                    'name' => 'gallery_image_' . $i,
                    'type' => 'image',
                    'return_format' => 'url',
                    'show_in_rest' => true,
                );
            }

            acf_add_local_field_group(array(
                'key' => 'group_properties_details',
                'title' => 'Property Details',
                'fields' => $property_fields,
                'location' => array(
                    array(
                        array(
                            'param' => 'post_type',
                            'operator' => '==',
                            'value' => 'properties',
                        ),
                    ),
                ),
                'show_in_rest' => true,
            ));

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
