# SIE File Parser för Mac

Ett Python-skript för att läsa och parsa SIE-filer (Standard Import Export) på Mac.

## Installation

### 1. Kontrollera Python-installation
```bash
python3 --version
```
Om Python inte är installerat, installera det via [python.org](https://www.python.org/downloads/) eller Homebrew:
```bash
brew install python3
```

### 2. Installera tkinter (för filväljaren)
På Mac kommer tkinter vanligtvis med Python, men om det saknas:
```bash
brew install python-tk
```

## Användning

### Kör skriptet direkt
```bash
cd sie-parser
python3 sie_reader.py
```

Detta öppnar en filväljare där du kan välja din SIE-fil (.se).

### Använd som modul i din egen kod
```python
from sie_reader import SIEReader

# Skapa en läsare
reader = SIEReader()

# Välj fil via dialog
reader.select_file()

# Läs filen
data = reader.read_file()

# Hämta filinfo
info = reader.get_file_info()
print(info)
```

## Funktioner (Fas 1)

- ✅ **Filväljare**: Mac-kompatibel dialog för att välja SIE-filer
- ✅ **Läs fil**: Läser SIE-filer med automatisk encoding-detektion
- ✅ **Encoding-hantering**: Stöd för svenska tecken (åäö)
- ✅ **Filinfo**: Visar filnamn, storlek och encoding

## Nästa steg

- [ ] Parsa SIE-struktur (#FLAGGA, #KONTO, etc.)
- [ ] Extrahera data till strukturerad format
- [ ] Exportera till Excel med flera flikar
- [ ] GUI för att visa data

## SIE-filformat

SIE-filer är textbaserade filer med följande struktur:
```
#FLAGGA 0
#FORMAT PC8
#PROGRAM "Programnamn"
#KONTO 1410 "Kassa"
#IB 0 1410 100.00
#VER A 1 20230101 "Verifikat"
{
    #TRANS 1410 {} 100.00
}
```

## Licens

Detta projekt är skapat för intern användning.
