const paletaColectivo = {
  primario: {
    DEFAULT: "#533A8E",
    oscuro: "#422E71",
    claro: "#7561A4",
  },
  secundario: {
    DEFAULT: "#FF6F15",
    oscuro: "#CC5810",
    claro: "#FF8B43",
  },
  terciario: {
    DEFAULT: "#EBCDDB",
    oscuro: "#BCA4AF",
    claro: "#EFD7E2",
  },
  negro: "#282828",
  gris: "#D0D0D0",
  blanco: "#FFFFFF",
  transparencia: { 
    0: "00",
    5: "0D",
    10: "1A",
    15: "26",
    20: "33",
    25: "40",
    30: "4D",
    35: "59",
    40: "66",
    45: "73",
    50: "80",
    55: "8C",
    60: "99",
    65: "A5",
    70: "B3",
    75: "BF",
    80: "CC",
    85: "D8",
    90: "E6",
    95: "F2",
    100: "FF"
  }  as { [key: number]: string },
}

export default paletaColectivo;
