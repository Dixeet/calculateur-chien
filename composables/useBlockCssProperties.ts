interface BlockProperties {
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  zIndex?: string | number;
  width?: string | number;
  maxWidth?: string | number;
  minWidth?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  minHeight?: string | number;
}

export default function useBlockCssProperties({
  position,
  top,
  bottom,
  left,
  right,
  zIndex,
  width,
  maxWidth,
  minWidth,
  height,
  maxHeight,
  minHeight,
}: BlockProperties) {
  const props = {
    position: {
      type: String,
      default: position ?? 'static',
      validator(position: string) {
        return ['static', 'relative', 'absolute', 'fixed', 'sticky'].includes(
          position,
        );
      },
    },
    top: {
      type: [String, Number],
      default: top ?? 'auto',
    },
    bottom: {
      type: [String, Number],
      default: bottom ?? 'auto',
    },
    left: {
      type: [String, Number],
      default: left ?? 'auto',
    },
    right: {
      type: [String, Number],
      default: right ?? 'auto',
    },
    zIndex: {
      type: [String, Number],
      default: zIndex ?? 3000,
    },
    width: {
      type: [String, Number],
      default: width ?? 'auto',
    },
    maxWidth: {
      type: [String, Number],
      default: maxWidth ?? 'auto',
    },
    minWidth: {
      type: [String, Number],
      default: minWidth ?? 'auto',
    },
    height: {
      type: [String, Number],
      default: height ?? 'auto',
    },
    maxHeight: {
      type: [String, Number],
      default: maxHeight ?? 'auto',
    },
    minHeight: {
      type: [String, Number],
      default: minHeight ?? 'auto',
    },
  };
  return props;
}
