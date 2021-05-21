
================================== HƯỚNG DẪN KÍCH HOẠT VÀ SỬ DỤNG REAL ESTATE M&M ==================================

	Real Estate M&M được xây dựng, phát triển bởi NodeJS và sử dụng MongoDB làm cơ sở dữ liệu cho trang web.
 Trang web được xây dựng nhầm mục đích tạo môi trường cho các khách hàng có thể dễ dàng tìm kiếm các loại hình bất
 động sản theo nhu cầu và mục đích sử dụng của mình. Đồng thời thông qua việc đăng tin từ người dùng, nhà sử dụng
 Real Estate M&M sẽ có thể thu lợi nhuận (thu nhập). Vậy làm thế nào để triển khai và sử dụng Real Estate M&M?
 
------ 1. Công việc chuẩn bị: ---------------------------------------------------------------------------------------

	- Vì được xây dựng và phát triển trên nền tảng NodeJS nên đầu tiên người dùng (nhà sử dụng) cần phải cài đặt
NodeJS trên máy tính / laptop công ty.

	- Để cài đặt NodeJS nhà sử dụng chỉ cần truy cập vào đường link: "https://nodejs.org/en/download/" và chọn
phiên bản phù hợp với caus trúc của máy tính / laptop.

	- Sau khi tải về người dùng chỉ việc click vào file đó và tiến hành cài đặt NodeJS để tạo môi trường triển
khai và sử dụng Real Estate M&M.

---------------------------------------------------------------------------------------------------------------------

------ 2. Triển khai và sử dụng Real Estate M&M ---------------------------------------------------------------------

	- Sau khi đã cài đặt xong NodeJS, người dùng di chuyển đến folder "n21_g13_quanlybatdongsan" -> "Source"
	
	- Tại nơi hiển thị đường path, người dùng nhập "cmd" để mở môi trường làm việc Command Prompt tại nơi đang
chứa source code gồm các package, models,... cần thiết.

	- Khi Command Prompt mở ra, người sử dụng nhập "node app.js" hoặc "npm start" để kích hoạt server của trang
web Real Estate M&M.

	- Khi server đã được kích hoạt, ở Command Prompt người dùng sẽ thấy xuất hiện dòng chữ "http://localhost:8888/"
chính là số port mà server trang web đang hoạt động.

	- Người sử dụng mở trình duyệt của mình lên (Chrome, FireFox, Microsoft Edge,...) và sau đó gõ "localhost:8888"
để có thể đi đến trang chủ của trang web Real Estate M&M. Và ở đây người dùng sẽ có thể trải nghiệm các chức năng mà
trang web cung cấp. (*Lưu ý: không được Command Prompt)

	- Khi người dùng muốn dừng và tắt server của website, người dùng thoát khỏi trình duyệt, sau đó vào Command
Prompt nơi đang start server của website, người dùng nhấn tổ hợp phím  "CTRL + C" và enter hoặc nhấn "Y" rồi enter (
nếu có) để tắt server đang được start của trang web.

---------------------------------------------------------------------------------------------------------------------


------ 3. Unit test---------------------------------------------------------------------
	- Để thực hiện unit test, sử dụng lệnh npm test.
======================================= FINISH, THANKS FOR YOUR READING ==============================================