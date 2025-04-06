## Deployment
- Kalau kamu ingin server langsung punya semua dependency, bisa pakai:
```bash
deno cache --lock=deno.lock main.ts
```
- Atau compile ke binary:
```bash
deno compile --allow-net main.ts
scp ./main user@server:/home/user/
```
- Di server tinggal ( No runtime, no cache, no download lagi. Super cepat dan portable ):
```bash
./main
```

## Manual
```bash
deno cache --lock=deno.lock --lock-write main.ts
```
```bash
deno run --allow-net --lock=deno.lock main.ts
```