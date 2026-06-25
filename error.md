A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

@presentei/web:dev:    ▲ Next.js 15.5.19
@presentei/web:dev:    - Local:        http://localhost:3000
@presentei/web:dev:    - Network:      http://192.168.124.7:3000
@presentei/web:dev:
@presentei/web:dev:  ✓ Starting...
@presentei/web:dev:  ✓ Ready in 22.5s
@presentei/web:dev:  ○ Compiling /middleware ...
@presentei/web:dev:  ✓ Compiled /middleware in 8s (168 modules)
@presentei/web:dev: <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (102kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
@presentei/web:dev: <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (250kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
@presentei/web:dev:  ○ Compiling /_not-found ...
@presentei/web:dev:  ✓ Compiled /_not-found in 33.7s (805 modules)

me ajude com estes erros