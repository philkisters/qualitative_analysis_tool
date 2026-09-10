export enum ImageType {
  Real = 'real',
  GT = 'gt',
  Prediction = 'prediction',
  PixelMask = 'pixel_mask',
  BlockMask = 'block_mask'
}

export type ImageIdentifier = {
  type: ImageType
  exit: 1 | 2 | 3 | 4
}

export function compareImageIdentifiers(left: ImageIdentifier | undefined, right: ImageIdentifier | undefined) {
  return left?.type === right?.type && left?.exit === right?.exit
}

export function useImageResolver() {
  function getImagePath(image: string, imageIdentifier: ImageIdentifier, config: Record<string, string> | undefined) {
    if (config === undefined || imageIdentifier.type === ImageType.Real) {
      return realImagePath(image)
    } else if (imageIdentifier.type === ImageType.GT) {
      return gtImagePath(image)
    } else {
      return exitImagePathFromIdentifier(image, imageIdentifier, config)
    }
  }

  function realImagePath(image: string) {
    return `/api/images/${image}/real`
  }
  function gtImagePath(image: string) {
    return `/api/images/${image}/gt`
  }

  function exitImagePathFromIdentifier(image: string, imageIdentifier: ImageIdentifier, config: Record<string, string>) {
    const params = new URLSearchParams(config)
    return `/api/images/${image}/${imageIdentifier.exit}/${imageIdentifier.type as 'prediction' | 'pixel_mask' | 'block_mask'}?${params.toString()}`
  }

  return {
    getImagePath
  }
}
