$(function() {
    // Listing row click event
    $('.listing tbody tr').on('mouseenter', function() {
        $(this).addClass('hover');
    }).on('mouseleave', function() {
        $(this).removeClass('hover');
    }).on('mousedown', function(e) {
        switch(e.which) {
            case 1:
                window.location.href = $(this).data('action');
                break;
            case 2:
                window.open($(this).data('action'), '_blank');
                break;
        }
    });
    
    // Remove attribute/variation
    $('.view .remove-attribute').on('click', function() {
        $(this).closest('tr').remove();
    });
    
    // Add attribute
    $('.view .add-attribute').on('click', function() {
        var html = '<tr><td width="20%"><input class="changeable" name="attributes[title][]" type="text"/></td><td width="60%"><input class="changeable" name="attributes[value][]" type="text" /></td><td width="10%"><label class="custom-control custom-checkbox ml-4 mt-1"><input name="attributes[is_variation][]" class="scapegoat-checkbox" type="hidden" value="off" /><input name="attributes[is_variation][]" type="checkbox" class="attributes-checkbox custom-control-input"><span class="custom-control-indicator"></span></label></td><td width="10%"><button type="button" class="btn btn-danger remove-attribute"><i class="fa fa-close"></i></button></td></tr>';
        $('#tab-attributes tbody').prepend(html);
        $('.view .remove-attribute').off('click').on('click', function() {
            $(this).closest('tr').remove();
        });
    });
    
    // Add variation
    $('.view .add-variation').on('click', function() {
        var html = '<tr><td width="20%" class="align-middle"><input name="variations[name][]" type="text" /></td><td width="10%" class="align-middle"><input name="variations[available_quantity][]" type="text" readonly /></td><td width="10%" class="align-middle">$<input name="variations[price][]" type="text" readonly /></td><td width="12%" class="align-middle">$<input name="variations[special_price][]" type="text" readonly /></td><td width="10%" class="align-middle">$<input class="non-empty changeable" name="variations[advertised][]" type="text" /></td><td width="10%" class="align-middle">$<input class="changeable" name="variations[final_price][]" type="text" /></td><td width="10%" class="align-middle"><img src="" width="50" /><input name="variations[image][]" type="hidden" /></td><td width="15%" class="align-middle"><button type="button" class="btn btn-primary change-variation-image" title="Change Image"><i class="fa fa-refresh"></i></button><button type="button" class="btn btn-danger remove-attribute" title="Remove Variation"><i class="fa fa-close"></i></button></td></tr>';
        $('#tab-variations tbody').prepend(html);
        $('.view .remove-attribute').off('click').on('click', function() {
            $(this).closest('tr').remove();
        });
        
        $('.change-variation-image').off('click').on('click', function() {
            var targetVariation = $(this);
            var modal = $('#imagemodal');

            $('#myModalLabel').html('Select Image');
            $('.modal-body').html($('#tab-images').html()).find('.remove-image').remove();
            $('.modal-body .image-container').on('click', function() {
                var imageUrl = $(this).find('img').attr('src');
                targetVariation.closest('tr').find('img').attr('src', imageUrl).siblings('input').val(imageUrl);
                modal.modal('hide');
            });

            modal.modal('show');
        });
    });
    
    // Images section pop up events and hover effects
    $('#tab-images, #tab-variations').find('img').on('mouseenter', function() {
        $(this).addClass('hover')
            .siblings('.remove-image').show();
    }).on('mouseleave', function() {
        $(this).removeClass('hover')
            .siblings('.remove-image').hide();
    }).on('click', function() {
        $('#myModalLabel').html('Image Preview');
        $('.modal-body').html('<img src="' + $(this).attr('src') + '" />');
        $('#imagemodal').modal('show');
    });
    
    // Sortable fields
    $('#tab-images .row').sortable();
    $('tbody').sortable();
    
    // Make sure hover class stays on remove image button hover
    $('.remove-image').on('mouseenter', function() {
        $(this).show().siblings('img').addClass('hover');
    }).on('mouseleave', function() {
        $(this).hide().siblings('img').removeClass('hover');
    });
    
    // Remove image when the X button is clicked
    $('.remove-image').on('click', function() {
        $(this).closest('.image-container').remove();
    });
    
    // Remove image on scroll click
    $('.image-container').on('mousedown', function(e) {
        if (e.which === 2) {
            $(this).remove();
        }
    });
    
    // Change variation image
    $('.change-variation-image').on('click', function() {
        var targetVariation = $(this);
        var modal = $('#imagemodal');
        
        $('#myModalLabel').html('Select Image');
        $('.modal-body').html($('#tab-images').html()).find('.remove-image').remove();
        $('.modal-body .image-container').on('click', function() {
            var imageUrl = $(this).find('img').attr('src');
            targetVariation.closest('tr').find('img').attr('src', imageUrl).siblings('input').val(imageUrl);
            modal.modal('hide');
        });
        
        modal.modal('show');
    });
    
    // Add images to description
    $('.add-images-to-description').on('click', function() {
        var modal = $('#imagemodal');
        
        $('#myModalLabel').html('Select Images');
        $('.modal-body').html($('#tab-images').html()).find('.remove-image').remove();
        $('.modal-body .image-container').on('click', function() {
            var selectedImageUrl = $(this).find('img').attr('src');
            $('#modif-description').val(function(i, text) {
                return text + '[image=' + selectedImageUrl + ']';
            });
            
            modal.modal('hide');
        });
        
        modal.modal('show');
    });
    
    // Confirm product delete/reset
    $('.delete-product, .reset-product').on('click', function() {
        $('.modal-body').html('<a href="' + $(this).data('href') + '"><button type="button" class="btn btn-danger">Do it!</button></a>');
        $('#myModalLabel').html('Are you sure?');
        $('#imagemodal').addClass('confirm-modal').modal('show');
    });
    
    // Before view form is saved
    $('.product-view-form').submit(function(e) {
        $('.attributes-checkbox:checked').siblings('.scapegoat-checkbox').remove();
        
        if ($('#orig-title').val() === $('#modif-title').val()) {
            postError('You made no changes to the <b>product title</b>', e);
            return false;
        }
        
        if ($('#orig-low-price').val() === $('#modif-price').val()) {
            postError('You made no changes to the <b>price</b>', e);
            return false;
        }
        
        if ($('#tab-attributes input:text').filter(function() { return $(this).val() == ""; }).size() > 0) {
            postError('You have some <b>empty attributes</b>', e);
            return false;
        }
        
        if ($('#tab-variations .non-empty').filter(function() { return $(this).val() == 0 ; }).size() > 0) {
            postError('You missed some <b>variation prices</b>', e);
            return false;
        }
        
        $('#tab-variations img').each(function() {
            var src = $(this).attr('src');
            if ($('#tab-images [src="' + src + '"]').size() === 0) {
                postError('You removed one of your selected <b>variation images</b>', e);
                return false;
            }
        });
        
        if ($('#tab-variations tbody tr').size() > 0 && $('#tab-attributes input:checkbox:checked').size() === 0) {
            postError('You have variations, but <b>no attribute supports variations</b>', e);
            return false;
        }
    });
    
    postError = function(error, event) {
        event.preventDefault();
        $('.modal-body').html(error);
        $('#myModalLabel').html("Caution!");
        $('#imagemodal').addClass('confirm-modal').modal('show');
    };
});