var Dia_chi_Dich_vu="http://localhost:3000"
var Dia_chi_Media=Dia_chi_Dich_vu +"/Media"
// Xử lý Thể hiện
class XL_THE_HIEN{
  Tao_Chuoi_HTML_Danh_sach_Phong(Danh_sach){
      var Chuoi_HTML_Danh_sach=`<div class='row' >`
      
      Danh_sach.forEach(Phong=>{
        var n = Phong.DanhSachThuePhong.length
        var KH_hien_tai = 0        
        var TrangThai = ''
        if (Phong.TrangThai == 0)
            TrangThai = 'Còn trống'
        else if (Phong.TrangThai == 1){
            TrangThai = 'Đã cho thuê'
            KH_hien_tai=Phong.DanhSachThuePhong[n-1].DanhSachKhachHang.length
        }           
        var Chuoi_KH_hien_tai =`<span data-toggle='collapse' style='color:red'
                                  data-target='#DSKH_${Phong.Ma_so}' >
                                ${KH_hien_tai} </span>`
        
        var Chuoi_Hinh=`<img  src='${Dia_chi_Media}/${Phong.Ma_so}.jpg' 
                                style='width:200px;height:100px' />`
        var Chuoi_Thong_tin=`<div class='btn' style='text-align:left'> 
                     <br />${Phong.Ten}
                     <br />Trạng thái: ${TrangThai }
                     <br />Loại Phòng: ${Phong.LoaiPhong.Ma_so }
                     <br />Khu vực: ${Phong.Khu_vuc }  
                     <br />Đơn giá: ${this.format_Tien_thue(Phong.LoaiPhong.DonGia)} 
                     <br />Số KH hiện tại: ${Chuoi_KH_hien_tai }
                           </div>`
          var Chuoi_DanhSachKhachHang = ''
          if (Phong.TrangThai == 1)
            Chuoi_DanhSachKhachHang= `<br />${this.Tao_Chuoi_HTML_DanhSachKhachHang(Phong)}`               
        var Chuoi_HTML=`<div class='col-md-3' 
                               style='margin-bottom:10px'>
                          ${Chuoi_Hinh}
                          ${Chuoi_Thong_tin}
                          ${Chuoi_DanhSachKhachHang}
                         </div>`
       Chuoi_HTML_Danh_sach +=Chuoi_HTML
      })
      Chuoi_HTML_Danh_sach+=`</div>`
      return Chuoi_HTML_Danh_sach
   }   
   Tao_Chuoi_HTML_DanhSachKhachHang(Phong){
    var Chuoi_HTML_Danh_sach=`<div class='collapse' 
                                 id='DSKH_${Phong.Ma_so}' >`
    var n = Phong.DanhSachThuePhong.length
    var DS_thue_hien_tai = Phong.DanhSachThuePhong[n-1]
    var NgayBatDau = new Date(DS_thue_hien_tai.NgayBatDau)
    var NgayDuKienTra = new Date(DS_thue_hien_tai.NgayDuKienTra)
    Chuoi_HTML_Danh_sach += `Ngày bắt đầu: ${NgayBatDau.toDateString()}<br />Ngày dự kiến trả phòng: ${NgayDuKienTra.toDateString()}<br />Danh sách khách hàng đang thuê phòng:<br />`
    DS_thue_hien_tai.DanhSachKhachHang.forEach(KH=>{
        var Chuoi_HTML=`<div class='btn' >
        Họ tên: ${KH.HoTen}<br />
        Số CMND: ${KH.CMND}
        </div>`
        Chuoi_HTML_Danh_sach+=Chuoi_HTML             
    })
    Chuoi_HTML_Danh_sach+='</div>'
    return Chuoi_HTML_Danh_sach
  }
  format_Tien_thue(TienThue){
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    })
    var num = formatter.format(TienThue)    
    return num
 }
}
//Xử lý Nghiệp vụ
class XL_NGHIEP_VU{
  Tra_cuu_Phong(Chuoi_Tra_cuu,Danh_sach){
    Chuoi_Tra_cuu =Chuoi_Tra_cuu.toUpperCase()
    var Danh_sach_Kq= []
    Danh_sach.forEach( Phong =>
         {  var Ten=Phong.Ten.toUpperCase()
            var LoaiPhong=Phong.LoaiPhong.Ma_so.toUpperCase()
            var Khu_vuc=Phong.Khu_vuc.toUpperCase()
            if (Ten.indexOf(Chuoi_Tra_cuu)>=0 
                      || LoaiPhong.indexOf(Chuoi_Tra_cuu)>=0
                      || Khu_vuc.indexOf(Chuoi_Tra_cuu)>=0)
                  Danh_sach_Kq.push(Phong)
          
           })
    if (Chuoi_Tra_cuu=="")    
      Danh_sach_Kq =Danh_sach       
    return Danh_sach_Kq
   }
}
// Xử lý Lưu trữ 
const Xu_ly_HTTP=require("axios")
class XL_LUU_TRU{
  Doc_Khach_san(Ham_Xu_ly){
    var Ma_so_Xu_ly="Doc_Khach_san"
    var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}/${Ma_so_Xu_ly}`
    Xu_ly_HTTP.get(Dia_chi_Xu_ly).then(res=>{
            var Doi_tuong_B=res.data
            Ham_Xu_ly(Doi_tuong_B)
          })  
  }
  Doc_Danh_sach_Phong(Ham_Xu_ly){
    var Ma_so_Xu_ly="Doc_Danh_sach_Phong"
    var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}/${Ma_so_Xu_ly}`
    Xu_ly_HTTP.get(Dia_chi_Xu_ly).then(res=>{
            var Doi_tuong_B=res.data
            Ham_Xu_ly(Doi_tuong_B)
          })  
  }

  async Cho_thue_Phong(Ma_so,NgayBatDau, NgayDuKienTra,HoTenKhachHang1,CMND1,HoTenKhachHang2,CMND2,HoTenKhachHang3,CMND3){
    var Doi_tuong_A = {}
      Doi_tuong_A.Ma_so = Ma_so
      Doi_tuong_A.NgayBatDau=NgayBatDau
      Doi_tuong_A.NgayDuKienTra=NgayDuKienTra
      Doi_tuong_A.HoTenKhachHang1= HoTenKhachHang1
      Doi_tuong_A.CMND1= CMND1
      Doi_tuong_A.HoTenKhachHang2=HoTenKhachHang2
      Doi_tuong_A.CMND2= CMND2
      Doi_tuong_A.HoTenKhachHang3= HoTenKhachHang3
      Doi_tuong_A.CMND3= CMND3
    var Ma_so_Xu_ly="Cho_thue_Phong"
    var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}/${Ma_so_Xu_ly}`
    var res = await Xu_ly_HTTP.post(Dia_chi_Xu_ly,Doi_tuong_A)
    var Doi_tuong_B=res.data
    var Kq = Doi_tuong_B.Kq
    return Kq 
  }

  async Tra_Phong(Ma_so){
    var Doi_tuong_A = {}
    Doi_tuong_A.Ma_so= Ma_so
    var Ma_so_Xu_ly="Tra_Phong"
    var Dia_chi_Xu_ly = `${Dia_chi_Dich_vu}/${Ma_so_Xu_ly}`
    var res = await Xu_ly_HTTP.post(Dia_chi_Xu_ly,Doi_tuong_A)
    var Doi_tuong_B=res.data
    var Kq = Doi_tuong_B.Kq
    return Kq 
  }
}

module.exports.Luu_tru=new XL_LUU_TRU()
module.exports.Nghiep_vu=new XL_NGHIEP_VU()
module.exports.The_hien=new XL_THE_HIEN()