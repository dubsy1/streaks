#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SIE File Parser for Mac
Läser och parserar SIE-filer (Standard Import Export)
"""

import tkinter as tk
from tkinter import filedialog
import os


class SIEReader:
    """Klass för att läsa och parsa SIE-filer"""

    def __init__(self):
        self.file_path = None
        self.raw_data = None
        self.encoding = 'cp437'  # Standard SIE encoding (IBM437)

    def select_file(self):
        """
        Öppnar en filväljare för att välja SIE-fil (Mac-kompatibel)
        Returnerar: sökväg till vald fil eller None
        """
        # Skapa ett dolt root-fönster för filväljaren
        root = tk.Tk()
        root.withdraw()  # Dölj root-fönstret
        root.lift()  # Lyft dialogrutan till förgrunden (viktigt på Mac)
        root.attributes('-topmost', True)  # Håll dialogrutan överst

        # Öppna filväljaren
        file_path = filedialog.askopenfilename(
            title="Välj SIE-fil",
            filetypes=[
                ("SIE-filer", "*.se"),
                ("SIE-filer", "*.SE"),
                ("Alla filer", "*.*")
            ],
            initialdir=os.path.expanduser("~")
        )

        root.destroy()  # Stäng root-fönstret

        if file_path:
            self.file_path = file_path
            print(f"✓ Vald fil: {os.path.basename(file_path)}")
            return file_path
        else:
            print("✗ Ingen fil vald")
            return None

    def read_file(self, file_path=None):
        """
        Läser innehållet från SIE-filen
        Försöker olika encodings för att hantera svenska tecken
        """
        if file_path:
            self.file_path = file_path

        if not self.file_path:
            print("✗ Ingen fil vald. Använd select_file() först.")
            return None

        # Testa olika encodings (SIE-filer kan ha olika encodings)
        encodings_to_try = ['cp437', 'iso-8859-1', 'utf-8', 'windows-1252']

        for encoding in encodings_to_try:
            try:
                with open(self.file_path, 'r', encoding=encoding) as file:
                    self.raw_data = file.read()
                    self.encoding = encoding

                    # Räkna antal rader
                    lines = self.raw_data.strip().split('\n')
                    print(f"✓ Fil läst med {encoding} encoding")
                    print(f"  Filstorlek: {len(self.raw_data)} tecken")
                    print(f"  Antal rader: {len(lines)}")

                    # Visa första raderna som test
                    print("\n--- Första 5 raderna ---")
                    for i, line in enumerate(lines[:5], 1):
                        print(f"{i}: {line[:80]}...")  # Visa max 80 tecken

                    return self.raw_data

            except UnicodeDecodeError:
                continue
            except Exception as e:
                print(f"✗ Fel vid läsning med {encoding}: {e}")
                continue

        print(f"✗ Kunde inte läsa filen med någon av encodings: {encodings_to_try}")
        return None

    def get_file_info(self):
        """Returnerar information om den valda filen"""
        if not self.file_path:
            return None

        return {
            'filename': os.path.basename(self.file_path),
            'path': self.file_path,
            'size': os.path.getsize(self.file_path),
            'encoding': self.encoding
        }


def main():
    """Huvudfunktion för att testa SIE-läsaren"""
    print("=" * 60)
    print("SIE FILEREADER - Test")
    print("=" * 60)

    # Skapa en SIE-läsare
    reader = SIEReader()

    # Välj fil
    print("\n1. Öppnar filväljare...")
    file_path = reader.select_file()

    if not file_path:
        print("\nAvslutar - ingen fil vald.")
        return

    # Läs filen
    print("\n2. Läser fil...")
    data = reader.read_file()

    if data:
        print("\n3. Filinfo:")
        info = reader.get_file_info()
        print(f"  Namn: {info['filename']}")
        print(f"  Storlek: {info['size']} bytes")
        print(f"  Encoding: {info['encoding']}")
        print(f"  Sökväg: {info['path']}")

        print("\n✓ Fil läst framgångsrikt!")
    else:
        print("\n✗ Kunde inte läsa filen")

    print("\n" + "=" * 60)


if __name__ == "__main__":
    main()
