/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    
    export default component
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_HOST: string
    readonly VITE_BACKEND_PORT?: string;
    readonly VITE_BACKEND_SSL: string;

    readonly VITE_MEDIA_HOST?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
