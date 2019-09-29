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
  var Quan_ly={}
  var Chuoi_HTML_Thong_bao=''
  if (!Ma_so_Chuc_nang){
    Chuoi_HTML_Thong_bao="Nhập Tên đăng nhập và Mật khẩu"
    res.render("MH_Dang_nhap",
       {Chuoi_HTML_Thong_bao:Chuoi_HTML_Thong_bao})
  }
  else if (Ma_so_Chuc_nang=="DANG_NHAP") {
    var Ten_Dang_nhap=req.body.Th_Ten_Dang_nhap
    var Mat_khau=req.body.Th_Mat_khau
    Quan_ly=Khach_san.Danh_sach_Quan_ly.find(x=>
         x.Ten_Dang_nhap==Ten_Dang_nhap && x.Mat_khau==Mat_khau)
    if (Quan_ly){
      Quan_ly.Danh_sach_Phong=Du_lieu.Danh_sach_Phong
      req.session.Quan_ly=Quan_ly
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
  var Quan_ly=req.session.Quan_ly
  var Ma_so_Chuc_nang=req.body.Th_Ma_so_Chuc_nang
  // Dữ liệu Kết quả 
  var Tieu_de=''
  var Chuoi_HTML_ket_qua=''
  if (!Quan_ly)
      res.redirect("/")
  else {
    Tieu_de="Quản lý khách sạn " + Quan_ly.Ho_ten
    if (! Ma_so_Chuc_nang   )  {
      var Danh_sach_Phong_Xem=Quan_ly.Danh_sach_Phong
      Chuoi_HTML_Ket_qua=The_hien.Tao_Chuoi_HTML_Danh_sach_Phong(Danh_sach_Phong_Xem)
    }
    else if (Ma_so_Chuc_nang=="TRA_CUU"){
      var Chuoi_Tra_cuu=req.body.Th_Chuoi_Tra_cuu
      var Danh_sach_Phong_Xem=Nghiep_vu.Tra_cuu_Phong(Chuoi_Tra_cuu,Quan_ly.Danh_sach_Phong)
      Chuoi_HTML_Ket_qua=The_hien.Tao_Chuoi_HTML_Danh_sach_Phong(Danh_sach_Phong_Xem)
     }
     res.render("MH_Chinh",{
        Tieu_de:Tieu_de,
        Chuoi_HTML_Ket_qua:Chuoi_HTML_Ket_qua
    })
  } 
})
 
Ung_dung.post("/Thong_ke", async (req,res)=>{
  // Dữ liệu Nguồn 
  var Doi_tuong_A = req.body
  var Ma_so_Chuc_nang=Doi_tuong_A.Th_Ma_so_Chuc_nang
  // Dữ liệu Kết quả 
  var Tieu_de='Thồng kê doanh thu năm'
  var Chuoi_HTML_ket_qua='' 
  if (Ma_so_Chuc_nang=="ChucNangThongKe"){      
    var Nam = Doi_tuong_A.Th_Nam
    var Doi_tuong_B = await Luu_tru.Thong_ke(Nam)    
    if (Doi_tuong_B)
      Chuoi_HTML_Ket_qua = The_hien.Tao_Chuoi_HTML_Thong_ke(Nam, Doi_tuong_B)
    else
      Chuoi_HTML_Ket_qua = 'NOT OK'            
  }
  res.render("MH_Chinh",{
    Tieu_de:Tieu_de,
    Chuoi_HTML_Ket_qua:Chuoi_HTML_Ket_qua
  })     
})