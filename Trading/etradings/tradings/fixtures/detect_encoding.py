if __name__ == "__main__":
    import chardet
    import json

    # Đọc file JSON để phát hiện encoding
    with open('data.json', 'rb') as f:
        raw_data = f.read()
        result = chardet.detect(raw_data)
        encoding = result['encoding']
        print(f"Detected encoding: {encoding}")

    # Đọc file JSON với encoding đã phát hiện
    with open('data.json', 'r', encoding=encoding) as f:
        data = json.load(f)

    # In ra nội dung của file JSON
    print(data)