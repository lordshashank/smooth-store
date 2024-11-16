import Image from "next/image";
import {
  folder as folderIcon,
  imageIcon,
  documentIcon,
  audio,
  drawing,
  video,
} from "../../public";

interface FileIconProps {
  mimeType: string;
  size: string;
}
const FileIcon: React.FC<FileIconProps> = ({ mimeType, size }) => {
  let iconSrc;
  const width = size === "small" ? 20 : 32;
  switch (mimeType) {
    case "image/jpeg":
    case "image/png":
    case "image/gif":
      iconSrc = imageIcon;
      break;
    case "application/pdf":
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      iconSrc = documentIcon;
      break;
    // Add more cases for other mime types and their corresponding icons
    case "audio/mpeg":
    case "audio/wav":
    case "audio/midi":
    case "audio/ogg":
    case "audio/aac":
    case "audio/flac":
    case "audio/x-ms-wma":
    case "audio/x-m4a":
      iconSrc = audio;
      break;
    case "video/mp4":
    case "video/mpeg":
    case "video/webm":
    case "video/ogg":
    case "video/quicktime":
    case "video/x-msvideo":
    case "video/x-ms-wmv":
    case "video/3gpp":
    case "video/x-flv":
      iconSrc = video;
      break;
    case "image/drawing":
      iconSrc = drawing;
      break;
    default:
      iconSrc = folderIcon;
      break;
  }
  return <Image src={iconSrc} width={width} height={width} alt="icon" />;
};

export default FileIcon;
