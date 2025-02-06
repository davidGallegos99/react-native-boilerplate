import TrackPlayer, { Track } from "react-native-track-player";

let reproductorInicializado = false;

const archivosSonido: Record<string, any> = {
  punto: require("../sounds/punto.mp3"),
  victoria: require("../sounds/victoria.mp3"),
};

export const setupPlayer = async (): Promise<void> => {
  try {
    if (!reproductorInicializado) {
      await TrackPlayer.setupPlayer();

      // Asegúrate de registrar el servicio solo una vez
      if (!TrackPlayer.isServiceRunning()) {
        TrackPlayer.registerPlaybackService(() =>
          require("../../../../../../trackPlayerService")
        );
      }

      reproductorInicializado = true;
    }
  } catch (error) {
    console.error("Error al inicializar el reproductor:", error);
  }
};

export const playSound = async (archivo: string): Promise<void> => {
  try {
    if (!reproductorInicializado) {
      await setupPlayer();
    }

    if (!archivosSonido[archivo]) {
      console.warn(`Sonido "${archivo}" no encontrado.`);
      return;
    }

    await TrackPlayer.reset(); // Limpia cualquier pista en reproducción

    const track: Track = {
      id: archivo,
      url: archivosSonido[archivo], // Archivo de sonido
      title: archivo, // Título (puedes modificarlo si necesitas)
      artist: "Aplicación", // Artista (puedes modificarlo si necesitas)
    };

    await TrackPlayer.add([track]);
    await TrackPlayer.play();

    // Obtiene la duración de la pista y detiene la reproducción después de que finalice
    const { duration } = await TrackPlayer.getProgress();
    if (duration && duration > 0) {
      setTimeout(async () => {
        await TrackPlayer.stop();
      }, duration * 1000);
    }
  } catch (error) {
    console.error("Error al reproducir sonido:", error);
  }
};

export const stopSound = async (): Promise<void> => {
  try {
    await TrackPlayer.stop(); // Detiene la reproducción del audio
  } catch (error) {
    console.error("Error al detener sonido:", error);
  }
};
