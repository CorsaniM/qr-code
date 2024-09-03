export default async function RootLayout(props: { children: React.ReactNode }) {
    return (
      <html lang="es">
        <body>
          <div className="mb-10 flex justify-center">{props.children}</div>
          <div></div>
        </body>
      </html>
    );
  }
  