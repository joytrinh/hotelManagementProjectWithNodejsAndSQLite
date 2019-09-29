const EXPRESS=require("express")
const SESSION=require("express-session")
const Luu_tru=require("./Xu_ly/XL_3L").Luu_tru
const Nghiep_vu=require("./Xu_ly/XL_3L").Nghiep_vu
const The_hien=require("./Xu_ly/XL_3L").The_hien

var Du_lieu={}
Luu_tru.Doc_Khach_san((Doi_tuong)=>{
  Du_lieu.Khach_san=Doi_tuong
  Luu_tru.Doc_Danh_sach_Phong((Danh_sach)=>{
    Du_lieu.Danh_sach_Phong=Danh_sach
  })
})


// Khai báo và cáu hình Ứng dụng EJS
var Ung_dung=EXPRESS()
Ung_dung.set("view engine","ejs")
Ung_dung.set("views","Giao_dien")
Ung_dung.use(SESSION({secret:'123321'}))
Ung_dung.use(EXPRESS.urlencoded({extended:true} ))

Ung_dung.listen(4000)

Ung_dung.all("/",(req,res)=>{
  var Khach_san=Du_lieu.Khach_san
  // Dữ liệu Nguồn 
  var Ma_so_Chuc_nang=req.body.Th_Ma_so_Chuc_nang
  // Dữ liệu Kết quả 
  var Tiep_tan={}
  var Chuoi_HTML_Thong_bao=''
  if (!Ma_so_Chuc_nang){
    Chuoi_HTML_Thong_bao="Nhập Tên đăng nhập và Mật khẩu"
    res.render("MH_Dang_nhap",
       {Chuoi_HTML_Thong_bao:Chuoi_HTML_Thong_bao})
  }
  else if (Ma_so_Chuc_nang=="DANG_NHAP") {
    var Ten_Dang_nhap=req.body.Th_Ten_Dang_nhap
    var Mat_khau=req.body.Th_Mat_khau
    Tiep_tan=Khach_san.Danh_sach_Tiep_tan.find(x=>
         x.Ten_Dang_nhap==Ten_Dang_nhap && x.Mat_khau==Mat_khau)
    if (Tiep_tan){
      Tiep_tan.Danh_sach_Phong=Du_lieu.Danh_sach_Phong.filter((x)=> {
        return x.Khu_vuc==Tiep_tan.Khu_vuc.Ma_so})      
      req.session.Tiep_tan=Tiep_tan
      res.redirect("/MH_Chinh")
    }
    else {
      Chuoi_HTML_Thong_bao="Không hợp lệ"
      res.render("MH_Dang_nhap",
       {Chuoi_HTML_Thong_bao:Chuoi_HTML_Thong_bao})
    }

  }
         
})
 
Ung_dung.all("/MH_Chinh",(req,res)=>{
  // Dữ liệu Nguồn 
  var Tiep_tan=req.session.Tiep_tan
  var Ma_so_Chuc_nang=req.body.Th_Ma_so_Chuc_nang
  // Dữ liệu Kết quả 
  var Tieu_de=''
  var Chuoi_HTML_ket_qua=''
  if (!Tiep_tan)
      res.redirect("/")
  else {
    Tieu_de="Tiếp tân khách sạn " + Tiep_tan.Ho_ten
    
    if (! Ma_so_Chuc_nang   )  {
      var Danh_sach_Phong_Xem=Tiep_tan.Danh_sach_Phong
      Chuoi_HTML_Ket_qua=The_hien.Tao_Chuoi_HTML_Danh_sach_Phong(Danh_sach_Phong_Xem)
    }
    else if (Ma_so_Chuc_nang=="TRA_CUU"){
      var Chuoi_Tra_cuu=req.body.Th_Chuoi_Tra_cuu
      var Danh_sach_Phong_Xem =Nghiep_vu.Tra_cuu_Phong(Chuoi_Tra_cuu,Tiep_tan.Danh_sach_Phong)
      Chuoi_HTML_Ket_qua=The_hien.Tao_Chuoi_HTML_Danh_sach_Phong(Danh_sach_Phong_Xem)
     }
     
     res.render("MH_Chinh",{
        Tieu_de:Tieu_de,
        Chuoi_HTML_Ket_qua:Chuoi_HTML_Ket_qua
    })
  } 
})

Ung_dung.post("/Cho_thue_Phong", async (req,res)=>{
  // Dữ liệu Nguồn 
  var Tiep_tan=req.session.Tiep_tan
  var Doi_tuong_A = req.body
  var Ma_so_Chuc_nang=Doi_tuong_A.Th_Ma_so_Chuc_nang
  // Dữ liệu Kết quả 
  var Tieu_de='Cho Thuê Phòng'
  var Chuoi_HTML_ket_qua=''
  if (!Tiep_tan)
      res.redirect("/")
  else {
    Tiep_tan.Danh_sach_Phong=Du_lieu.Danh_sach_Phong.filter((x)=> {
      return x.Khu_vuc==Tiep_tan.Khu_vuc.Ma_so})  
    var Phong = Tiep_tan.Danh_sach_Phong.find(x=> x.Ma_so == Doi_tuong_A.Th_MaSoPhong)
    if (Phong) {
      if (Phong.TrangThai == 0) {
        if (Ma_so_Chuc_nang=="ChucNangChoThue"){
            var Ma_so=Doi_tuong_A.Th_MaSoPhong
            var NgayBatDau=Doi_tuong_A.Th_NgayBatDau
            var NgayDuKienTra=Doi_tuong_A.Th_NgayDuKienTra
            var HoTenKhachHang1=Doi_tuong_A.Th_HoTenKhachHang1
            var CMND1=Doi_tuong_A.Th_CMND1
            var HoTenKhachHang2=Doi_tuong_A.Th_HoTenKhachHang2
            var CMND2=Doi_tuong_A.Th_CMND2
            var HoTenKhachHang3=Doi_tuong_A.Th_HoTenKhachHang3
            var CMND3=Doi_tuong_A.Th_CMND3
            
            var Kq = await Luu_tru.Cho_thue_Phong(Ma_so,NgayBatDau,NgayDuKienTra,HoTenKhachHang1,CMND1,HoTenKhachHang2,CMND2,HoTenKhachHang3,CMND3)
            if (Kq != 'NOT OK')
              Chuoi_HTML_Ket_qua = 'Đã ghi thành công'
            else
              Chuoi_HTML_Ket_qua = Kq          
        }
      }
      else if (Phong.TrangThai == 1)
        Chuoi_HTML_Ket_qua = 'Phòng này đang cho thuê. Vui lòng cho thuê phòng khác.'
    }
    else
      Chuoi_HTML_Ket_qua = 'Phòng này không thuộc quyền quản lý của bạn.'
  
    res.render("MH_Chinh",{
      Tieu_de:Tieu_de,
      Chuoi_HTML_Ket_qua:Chuoi_HTML_Ket_qua
      })
  }  
})

Ung_dung.post("/Tra_Phong", async (req,res)=>{
  // Dữ liệu Nguồn 
  var Tiep_tan=req.session.Tiep_tan
  var Doi_tuong_A = req.body
  var Ma_so_Chuc_nang=Doi_tuong_A.Th_Ma_so_Chuc_nang
  // Dữ liệu Kết quả 
  var Tieu_de='Trả Phòng'
  var Chuoi_HTML_ket_qua='' 
  if (!Tiep_tan)
      res.redirect("/")
  else {
    Tiep_tan.Danh_sach_Phong=Du_lieu.Danh_sach_Phong.filter((x)=> {
      return x.Khu_vuc==Tiep_tan.Khu_vuc.Ma_so})
    var Phong = Tiep_tan.Danh_sach_Phong.find(x=> x.Ma_so == Doi_tuong_A.Th_MSPhong)
    if (Phong) {
      if (Phong.TrangThai == 1) {
        if (Ma_so_Chuc_nang=="ChucNangTraPhong"){      
          var Ma_so=Doi_tuong_A.Th_MSPhong
          var Kq = await Luu_tru.Tra_Phong(Ma_so)
          if (Kq != '')
            Chuoi_HTML_Ket_qua = 'So tien thue la: ' + The_hien.format_Tien_thue(Kq)
          else
            Chuoi_HTML_Ket_qua = 'NOT OK'            
        }
      }
      else if (Phong.TrangThai == 0)
        Chuoi_HTML_Ket_qua = 'Phòng này đang trống. Vui lòng chọn trả phòng khác.'
    }
    else
      Chuoi_HTML_Ket_qua = 'Phòng này không thuộc quyền quản lý của bạn.'
    
    res.render("MH_Chinh",{
      Tieu_de:Tieu_de,
      Chuoi_HTML_Ket_qua:Chuoi_HTML_Ket_qua
    }) 
  } 
})