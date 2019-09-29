const sqlite3 = require('sqlite3')
const Path=require('path')
var Thu_muc=Path.join(__dirname,'..','Du_lieu')
var Ten_CSDL= 'Quan_ly_Khach_san.db'
var Duong_dan=Path.join(Thu_muc, Ten_CSDL)
class XL_LUU_TRU{
   //=======Đọc=====
   Doc_Khach_san(){
      return new Promise((OK,NOT_OK)=>{
         var Ten_Bang="Khach_san"
         var CSDL=new sqlite3.Database(Duong_dan)
         var Lenh=`Select * From ${Ten_Bang}`
         var Ham_Xu_ly=(Loi,Dong)=>{
            if (Loi) { 
               console.log(Loi)
               NOT_OK(Loi)
            }
            else {
               var Khach_san=JSON.parse(Dong.Chuoi_JSON)
               OK(Khach_san)
            }  
         }
         CSDL.get(Lenh,Ham_Xu_ly)
      })     
   }
   Doc_Danh_sach_Phong( ){
      return new Promise((OK,NOT_OK)=>{
         var Ten_Bang="Phong"
         var CSDL=new sqlite3.Database(Duong_dan)
         CSDL.all(`Select * From ${Ten_Bang}`,
            (Loi,Danh_sach_Dong)=>{
               if (!Loi){
                 var Danh_sach=Danh_sach_Dong.map(Dong=>
                           JSON.parse(Dong.Chuoi_JSON))
                 OK(Danh_sach)
               }        
               else 
                NOT_OK(Loi)
          })
      })
      
   }
//========= Ghi ======
   Ghi_Phong(Phong){
      return new Promise((OK,NOT_OK)=>{
         var CSDL=new sqlite3.Database(Duong_dan)
         var Chuoi_JSON=JSON.stringify(Phong)
         CSDL.run(`update Phong 
                 set Chuoi_JSON=? where Ma_so=?`,
                 [Chuoi_JSON,Phong.Ma_so],(Loi)=>{
                    if (!Loi) OK(true)
                    else   NOT_OK(Loi)
                  })
      })
   }
   async Thong_ke_tung_thang(Nam){
      var Danh_sach_Phong = await this.Doc_Danh_sach_Phong()
      var Doanh_thu_Thang_1 = 0
      var Doanh_thu_Thang_2 = 0
      var Doanh_thu_Thang_3 = 0
      var Doanh_thu_Thang_4 = 0
      var Doanh_thu_Thang_5 = 0
      var Doanh_thu_Thang_6 = 0
      var Doanh_thu_Thang_7 = 0
      var Doanh_thu_Thang_8 = 0
      var Doanh_thu_Thang_9 = 0
      var Doanh_thu_Thang_10 = 0
      var Doanh_thu_Thang_11 = 0
      var Doanh_thu_Thang_12 = 0
      Danh_sach_Phong.forEach(Phong => {
        Phong.DanhSachThuePhong.forEach(PhieuTP =>{
          var NgayTraPhong = new Date(PhieuTP.NgayTraPhong)
          var Thang = NgayTraPhong.getMonth()
          var Nam_PTP = NgayTraPhong.getFullYear()
          if (Nam_PTP == Nam) {
            if(Thang == 1)
            Doanh_thu_Thang_1 += PhieuTP.TienThue
            else if(Thang == 2)
              Doanh_thu_Thang_2 += PhieuTP.TienThue
            else if(Thang == 3)
              Doanh_thu_Thang_3 += PhieuTP.TienThue
            else if(Thang == 4)
              Doanh_thu_Thang_4 += PhieuTP.TienThue
            else if(Thang == 5)
              Doanh_thu_Thang_5 += PhieuTP.TienThue
            else if(Thang == 6)
              Doanh_thu_Thang_6 += PhieuTP.TienThue
            else if(Thang == 7)
              Doanh_thu_Thang_7 += PhieuTP.TienThue
            else if(Thang == 8)
              Doanh_thu_Thang_8 += PhieuTP.TienThue
            else if(Thang == 9)
              Doanh_thu_Thang_9 += PhieuTP.TienThue
            else if(Thang == 10)
              Doanh_thu_Thang_10 += PhieuTP.TienThue
            else if(Thang == 11)
              Doanh_thu_Thang_11 += PhieuTP.TienThue
            else if(Thang == 12)
              Doanh_thu_Thang_12 += PhieuTP.TienThue
          }                
        })      
      })
      var Doi_tuong_B = []
        Doi_tuong_B.push(Doanh_thu_Thang_1)
        Doi_tuong_B.push(Doanh_thu_Thang_2)
        Doi_tuong_B.push(Doanh_thu_Thang_3)
        Doi_tuong_B.push(Doanh_thu_Thang_4)
        Doi_tuong_B.push(Doanh_thu_Thang_5)
        Doi_tuong_B.push(Doanh_thu_Thang_6)
        Doi_tuong_B.push(Doanh_thu_Thang_7)
        Doi_tuong_B.push(Doanh_thu_Thang_8)
        Doi_tuong_B.push(Doanh_thu_Thang_9)
        Doi_tuong_B.push(Doanh_thu_Thang_10)
        Doi_tuong_B.push(Doanh_thu_Thang_11)
        Doi_tuong_B.push(Doanh_thu_Thang_12)
      return Doi_tuong_B
   }
}

var Xu_ly=new XL_LUU_TRU()
module.exports=Xu_ly

 
