

$(document).ready(function(){
    var selectedItem = null;
    var listOfSelectedItems = [];
    $('.itemNameLink').click(function(){
            $("input[type=number]").val(1);
            selectedItem  = $(this).closest('.menu-item-content').find('#selectedItem').val();
            selectedItem = JSON.parse(selectedItem);
            $('.modal-title')[0].innerHTML = selectedItem.item_name;
            $('.modal-desc')[0].innerHTML = selectedItem.item_description;

    });

    $('#add-cart-btn').click(function(){
            var qty = parseInt($("input[type=number]").val());
            selectedItem["qty"] = qty;
            selectedItem["total_price"] = qty* selectedItem.item_price;
            $.ajax({
                url: "/addItemToCart",
                type: "POST",
                data: selectedItem,
                success: function(result){
                        $('.cart').html(result);
                        $('#cart-count').html("<li><a href='/checkout'>View Cart</a></li>");
                        $('.menu-user-initial').html(result);
                }
        });
    });

    if($('#showModal').length) {
        $('#myModal').show();
    }

    hide = () => {
        $('#myModal').hide();
    }
});