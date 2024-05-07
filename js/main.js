$(document).ready(function() {
    
    // Menu mobile

    $('nav#menu').mmenu({
       
        offCanvas   : {
            position: "right"
        },
        
    }); 
});


let oldValue = 1;
    
$('input[name="quantity"]').on('input', function(){
    if (!/^\d+$/.test(this.value)) {
        this.value = oldValue;
    } else {
        oldValue = this.value;
    }
    $('.add-cart').attr("data-qty", parseInt(this.value));
     
});


$('.plus').click(function(){
    var plus = parseInt($('input[name="quantity"]').val());
    plus++;
    $('input[name="quantity"]').val(plus);
    $('.add-cart').data("qty", plus);
    $('.add-cart').attr("data-qty", parseInt(plus));
})

$('.minus').click(function(){
    var minus = parseInt($('input[name="quantity"]').val());
    minus--;
    if(minus < 1){
       minus = 1;
    }else{
        minus = minus;
    }
    $('input[name="quantity"]').val(minus);
    $('.add-cart').attr("data-qty", parseInt(minus));
})



var carts = localStorage.getItem('carts');
var ar_cart = carts ? JSON.parse(carts) : [];

$('.add-cart').click(function(){
    $(this).addClass('disabled');
    if ($(this).children('.fa-check').length) {
        $(this).find('.fa-check').remove();
    }
    $(this).append('<i class=" ml-2 fas fa-sync fa-spin"></i>');
    var id = $(this).data('id');
    var name = $(this).data('name');
    var price = $(this).data('price');
    var qty = $(this).attr('data-qty');
    var img = $(this).data('img');
    var add_pro = {'id': id, 'image': img, 'name': name, 'price': price, 'qty': parseInt(qty)}

    var index = ar_cart.findIndex(function(cartItem) {
        return cartItem.id === add_pro.id;
    });

    if(index === -1){
        ar_cart.push(add_pro);
    }else{
        ar_cart[index].qty += add_pro.qty;
    }
    localStorage.setItem('carts', JSON.stringify(ar_cart));

    setTimeout(() =>  {
        $(this).find('.fa-sync.fa-spin').remove();
        $(this).append('<i class="ml-2 fas fa-check"></i>');

        var addedCart = $(this).siblings('.added-cart'); 
        if (!addedCart.length) {  
            $(this).after('<a href="carts.html" class="added-cart">Xem giỏ hàng</a>');
        }
        $(this).removeClass('disabled');
    }, 1000)

});

if(ar_cart.length <= 0) $('#carts-page').html('<p class=" my-4 text-center" style="color: red; font-size: 20px">Giỏ hàng rỗng!</p>')

var html = '';
var tong = 0;
if(ar_cart){
    for(var i = 0; i < ar_cart.length; i++ ){
        var formattedPrice = ar_cart[i].price.toLocaleString('vi-VN') + ' đ';
        var pricePro = ar_cart[i].price * ar_cart[i].qty;
        var formattedpricePro = pricePro.toLocaleString('vi-VN') + ' đ';
        tong += pricePro;
        html += '<tr key="'+i+'">'
                    +'<td><button type="button" class="del-pro"><i class="fas fa-trash-alt"></i></td>'
                    +'<td><img width="100px" src="'+ar_cart[i].image+'"></td>'
                    +'<td>'+ar_cart[i].name+'</td>'
                    +'<td>'+formattedPrice+'</td>'
                    +'<td> <input price="'+ar_cart[i].price+'" type="number" value="'+ar_cart[i].qty+'" /> </td>'
                    +'<td>'+formattedpricePro+' </td>'
                    +'</tr>'
    }
    tong = tong.toLocaleString('vi-VN') + ' đ';
    html +="<tr ><td colspan = '3'> <button type='button' class='del-cart btn btn-danger p-2'> <i class='mr-2 fas fa-trash-alt'></i>Xóa toàn bộ</button></td><td class='text-right' colspan = '3'> <b style='font-weight: bold'>Tổng: </b>"+tong+"</td></tr>"
    $('.table-carts tbody').html(html); 
}

$(document).on('click', '.table-carts button.del-pro', function() {
    if(confirm('Bạn có chắc chắn muốn xóa không?')){
        $('body').append(`<div class="loader" style="position:fixed;z-index:99999999;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background-color:rgba(0,0,0,0.51)"><i class=" ml-2 fas fa-sync fa-spin fa-3x" style="color:#ffffff"></i></div>`);
        var key = $(this).closest('tr').attr('key');
        
        setTimeout(() =>  {
            ar_cart.splice(key, 1);
            localStorage.setItem('carts', JSON.stringify(ar_cart));
            alert('Sản phẩm đã dược xóa khỏi giỏ hàng!');
            location.reload();
        }, 1000)
       
    }
})

$(document).on('blur', '.table-carts input', function() {
    if($(this).val() < 1) var newQty = 1;
    else var newQty = $(this).val();
    $('body').append(`<div class="loader" style="position:fixed;z-index:99999999;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background-color:rgba(0,0,0,0.51)"><i class=" ml-2 fas fa-sync fa-spin fa-3x" style="color:#ffffff"></i></div>`);
    var key = $(this).closest('tr').attr('key');
    ar_cart[key].qty = newQty;
    localStorage.setItem('carts', JSON.stringify(ar_cart));

    setTimeout(() =>  {
        alert('Sẩn phẩm được cập nhật thành công!');    
        location.reload();
    }, 1000)
    
});

$(document).on('click', '.table-carts button.del-cart', function() {
    if(confirm('Bạn có chắc chắn muốn xóa giỏ hàng không?')){
        $('body').append(`<div class="loader" style="position:fixed;z-index:99999999;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background-color:rgba(0,0,0,0.51)"><i class=" ml-2 fas fa-sync fa-spin fa-3x" style="color:#ffffff"></i></div>`);
        setTimeout(() =>  {
            localStorage.removeItem('carts');
            alert('Giỏ hàng đã được xóa thành công!');
            location.reload();
        }, 1000)
       
    }
})

$('.form-order').submit(function(event){
   event.preventDefault();
   $('body').append(`<div class="loader" style="position:fixed;z-index:99999999;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;background-color:rgba(0,0,0,0.51)"><i class=" ml-2 fas fa-sync fa-spin fa-3x" style="color:#ffffff"></i></div>`);
   
   setTimeout(() =>  {
        localStorage.removeItem('carts');
        alert('Bạn đã đặt hàng thành công!');
        location.reload();
    }, 1000);
});