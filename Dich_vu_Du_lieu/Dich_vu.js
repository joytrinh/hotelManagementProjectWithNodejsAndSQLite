const EXPRESS=require("express")
//===== Xử lý theo mô hình 3 -layers 
const Luu_tru=require('./Xu_ly/XL_LUU_TRU_SQLITE')
//=======================================
//===== Khai báo và Cấu hình Dịch vụ ====
const Dich_vu=EXPRESS()
Dich_vu.use("/Media",EXPRESS.static('Media'))
Dich_vu.use(EXPRESS.json())
Dich_vu.use((req,res,next)=>{
   res.setHeader("Access-Control-Allow-Origin", '*')
   res.setHeader("Access-Control-Allow-Headers", 'origin,Content-Type,Accept')
   next()
 })
//================

//===== Khởi động Dữ liệu ====
const PORT=3000
const Dia_chi_Media=`http://localhost:${PORT}/Media`
Dich_vu.get("/Doc_Khach_san", async (req,res)=>{
   var Khach_san = await Luu_tru.Doc_Khach_san()
   res.send(Khach_san)
}) 
Dich_vu.get("/Doc_Danh_sach_Phong", async (req,res)=>{
   var Danh_sach_Phong= await Luu_tru.Doc_Danh_sach_Phong()
   res.send(Danh_sach_Phong)
}) 
Dich_vu.post("/Cho_thue_Phong", async (req,res)=>{
   var Doi_tuong_A = req.body
   var Doi_tuong_B = {Kq:'NOT OK'}
   var Danh_sach_Phong= await Luu_tru.Doc_Danh_sach_Phong()
   var Phong = Danh_sach_Phong.find(x=> x.Ma_so == Doi_tuong_A.Ma_so)
   if(Phong){
      var PTP = {}
      PTP.NgayBatDau = new Date(Doi_tuong_A.NgayBatDau)
      PTP.NgayDuKienTra= new Date(Doi_tuong_A.NgayDuKienTra)
      PTP.NgayTraPhong = ''
      PTP.DanhSachKhachHang=[
         {
         "HoTen": Doi_tuong_A.HoTenKhachHang1,
         "CMND": Doi_tuong_A.CMND1
         }
      ]
      if(Doi_tuong_A.HoTenKhachHang2 != '')
         PTP.DanhSachKhachHang.push({"HoTen": Doi_tuong_A.HoTenKhachHang2, "CMND": Doi_tuong_A.CMND2})
      if(Doi_tuong_A.HoTenKhachHang3 != '')
         PTP.DanhSachKhachHang.push({"HoTen": Doi_tuong_A.HoTenKhachHang3, "CMND": Doi_tuong_A.CMND3})
      PTP.TienThue = 0
      Phong.DanhSachThuePhong.push(PTP)
      Phong.TrangThai = 1
      Doi_tuong_B.Kq = await Luu_tru.Ghi_Phong(Phong)
   }
   var Chuoi_JSON = JSON.stringify(Doi_tuong_B)
   res.send(Chuoi_JSON)
}) 
Dich_vu.post("/Tra_Phong", async (req,res)=>{
   var Doi_tuong_A = req.body
   var Doi_tuong_B = {Kq:'NOT OK'}
   var Danh_sach_Phong= await Luu_tru.Doc_Danh_sach_Phong()
   var Phong = Danh_sach_Phong.find(x=> x.Ma_so == Doi_tuong_A.Ma_so)
   if(Phong){
      var n = Phong.DanhSachThuePhong.length
      var PTP = Phong.DanhSachThuePhong[n-1]
      var NgayTraPhong = new Date()
      var NgayBatDau = new Date(PTP.NgayBatDau)
      PTP.NgayTraPhong = NgayTraPhong
      var Ngay = parseInt((NgayTraPhong - NgayBatDau)/(1000 * 60 * 60 * 24))
      PTP.TienThue = Ngay * Phong.LoaiPhong.DonGia
      var TienThue = parseInt(PTP.TienThue)
      Phong.TrangThai = 0
      var ghi = await Luu_tru.Ghi_Phong(Phong)
      Doi_tuong_B.Kq = TienThue.toString()            
   }
   var Chuoi_JSON = JSON.stringify(Doi_tuong_B)
   res.send(Chuoi_JSON)
}) 
Dich_vu.post("/Thong_ke", async (req,res)=>{
   var Doi_tuong_A = req.body
   var Nam = Doi_tuong_A.Nam
   var Doi_tuong_B = await Luu_tru.Thong_ke_tung_thang(Nam)   
   var Chuoi_JSON = JSON.stringify(Doi_tuong_B)
   res.send(Chuoi_JSON)
}) 
Dich_vu.listen(PORT)