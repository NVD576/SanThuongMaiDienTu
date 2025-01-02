if __name__ == "__main__":
    try:
        # Đọc file với encoding UTF-8 (hoặc encoding khác nếu cần)
        with open('data.json', 'r', encoding='utf-8') as f:
            content = f.read()

        # Ghi lại file với encoding UTF-8
        with open('data.json', 'w', encoding='utf-8') as f:
            f.write(content)

        print("File đã được chuyển đổi sang UTF-8 thành công.")
    except Exception as e:
        print(f"Có lỗi xảy ra: {e}")