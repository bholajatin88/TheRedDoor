$(document).ready(function(){
    $(document).on('click',"#submit-address", function(){
        var address = {
            _id: $("#addressId").val(),
            street: $("#street").val(),
            address_line_2: $("#line2").val(),
            city: $("#city").val(),
            state: $("#state").val(),
            zip: $("#zip").val()
        }
        $.ajax({
            url: "/updateAddress",
            type: "PUT",
            data: address
         }).done(function(data){
            $(".address-form").html(data);
            $('.success-msg').show();
            setTimeout(function(){
                $('.success-msg').hide();
            },3000);
         });
    });
}); 

function removeItem(id){
    $.ajax({
        url: "/removeItem",
        type: "PUT",
        data: {
            index: id
        }
     }).done(function(data){
        let rowCount = $(data).filter('table').length
         if(rowCount == 0) {
            $('main').html("<div id='site'><h1 class='bold'>Checkout</h1>"
            + "<div class='no-items'>Add Items in cart to checkout!!</div>"
            + "<div class='backBtn'><a href='/menu' class='back'>Order Now</a>"
            + "</div>")
         } else {
            $("#table-div").html(data);
         }
     });
}