# Página de registro

- Controlar todos los inputs y el formulario
- FormGroup, FormControl, ReactiveFormsModule (para la parte estructural)
- onSubmit
- Pasar la info de la parte lógica a la estructura (bindear los FormControl con los inputs del HTML + formGroup)
- Vamos a crear un método dentro del servicio userService para registrar un usuario
> No olviden que para utilizar pedidos externos necesitamos configurar 2 cosas: inject(HttpClient) en el servicio y providers: [provideRouter(routes), provideHttpClient()] en app.config.ts
- Podríamos crear un modelo para que TypeScript sepa cómo es un usuario (tipos de datos)
- Una vez todo listo:
    - Vamos a darle conocimiento del servicio user al componente register (inject)
    - Utilizar la función register del servicio para enviar la información recolectada
    - Redirigir (this.router.navigate(["/login"]))

# Página de login
- Controlar todos los inputs y el formulario
- FormGroup, FormControl, ReactiveFormsModule (para la parte estructural)
- onSubmit
- Pasar la info de la parte lógica a la estructura (bindear los FormControl con los inputs del HTML + formGroup)
- Vamos a crear un método dentro del servicio userService para LOGUEAR un usuario
- Una vez todo listo: