declare module "next" {
  export type Metadata = any;
  export type NextConfig = any;
  const next: any;
  export default next;
}

declare module "next/link" {
  import React from "react";
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: any;
    as?: any;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    children?: React.ReactNode;
  }
  const Link: React.ComponentType<LinkProps>;
  export default Link;
}

declare module "next/image" {
  import React from "react";
  const Image: React.FC<any>;
  export default Image;
}

declare module "next/server" {
  export class NextRequest extends Request {
    readonly nextUrl: URL;
    readonly cookies: any;
    readonly ip?: string;
    readonly geo?: any;
    constructor(input: RequestInfo | URL, init?: RequestInit);
  }

  export class NextResponse<Body = any> extends Response {
    static json<JsonBody = any>(body: JsonBody, init?: ResponseInit): NextResponse<JsonBody>;
    static redirect(url: string | URL, init?: number | ResponseInit): NextResponse;
    static rewrite(destination: string | URL, init?: ResponseInit): NextResponse;
    static next(init?: ResponseInit): NextResponse;
    readonly cookies: any;
  }
}

declare module "next/server.js" {
  export * from "next/server";
}

declare module "next/types.js" {
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
  export type * from "next";
}

declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  export type Metadata = any;
  export type ResolvingMetadata = any;
  export type ResolvingViewport = any;
}

declare module "next/*";
