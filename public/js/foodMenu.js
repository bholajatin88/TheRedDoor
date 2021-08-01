

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
            listOfSelectedItems.push(selectedItem);
            localStorage.setItem("cart", JSON.stringify(listOfSelectedItems));
    });
});