/**
 * Global JSX intrinsic element declarations.
 *
 * React 19 + @types/react v19 moved JSX types out of the global `JSX`
 * namespace into `React.JSX`. The triple-slash reference below ensures
 * @types/react is included, and the global augmentation re-exports those
 * types into the global `JSX` namespace so legacy code using `JSX.Element`
 * or `JSX.IntrinsicElements` continues to work without error.
 */

/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Element = React.ReactElement<any, any>;
    interface ElementClass extends React.Component<unknown> {
      render(): React.ReactNode;
    }
    interface ElementAttributesProperty {
      props: Record<string, unknown>;
    }
    interface ElementChildrenAttribute {
      children: unknown;
    }
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
    interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
  }
}


