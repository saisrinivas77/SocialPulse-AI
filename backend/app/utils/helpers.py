def chunk_list(items, size: int):
    return [items[index : index + size] for index in range(0, len(items), size)]
