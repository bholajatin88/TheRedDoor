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
            data: address,
            success: function(result){
                    
            }
         }).done(function(data){
            $(".address-form").html(data);
            $('.success-msg').show();
            setTimeout(function(){
                $('.success-msg').hide();
            },3000);
         });
    });
});