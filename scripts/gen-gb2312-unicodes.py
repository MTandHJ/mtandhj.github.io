"""Generate GB2312 unicode list for font subsetting.

Produces a text file with one unicode per line (U+XXXX format),
covering all GB2312 characters (6763 CJK + symbols) + ASCII.
"""
import sys


def generate_gb2312_unicodes():
    chars = set()

    # GB2312 Level 1: CJK characters (B0-F7, A1-FE)
    for hi in range(0xB0, 0xF8):
        for lo in range(0xA1, 0xFF):
            try:
                chars.add(ord(bytes([hi, lo]).decode("gb2312")))
            except (UnicodeDecodeError, ValueError):
                pass

    # GB2312 symbols and Level 2 (A1-A9, A1-FE)
    for hi in range(0xA1, 0xAA):
        for lo in range(0xA1, 0xFF):
            try:
                chars.add(ord(bytes([hi, lo]).decode("gb2312")))
            except (UnicodeDecodeError, ValueError):
                pass

    # ASCII printable characters (U+0020 - U+007E)
    for c in range(0x0020, 0x007F):
        chars.add(c)

    # Common punctuation not in GB2312
    extras = [
        0x2014,  # —
        0x2018,  # '
        0x2019,  # '
        0x201C,  # "
        0x201D,  # "
        0x2026,  # …
        0x3001,  # 、
        0x3002,  # 。
        0xFF0C,  # ，
        0xFF1A,  # ：
        0xFF1B,  # ；
        0xFF01,  # ！
        0xFF1F,  # ？
        0xFF08,  # （
        0xFF09,  # ）
        0x00B7,  # ·
    ]
    chars.update(extras)

    return sorted(chars)


def main():
    chars = generate_gb2312_unicodes()
    output = sys.argv[1] if len(sys.argv) > 1 else "gb2312_unicodes.txt"

    with open(output, "w", encoding="utf-8") as f:
        for c in chars:
            f.write(f"U+{c:04X}\n")

    print(f"Generated {len(chars)} unicode codepoints to {output}")


if __name__ == "__main__":
    main()