"""Everything the film says and when, in SOURCE seconds (the raw recording).

build-film.py maps these through edl.json to film time and writes the
compositions. Edit here, then run:
  uv run --project ../.. python scripts/build-film.py
"""

# The client's document (pedidos sofi.pdf, Be Unique, 19/10/2026).
DOC = {
    "brand": "BE UNIQUE",
    "brand_sub": "ESTÉTICA",
    "title": "Pedidos de cambios para el sistema Sofi",
    "meta": "19/10/2026 · Solicitado por Jose · 9 pedidos",
}

# status: ok (resuelto) · rev (revisado) · ask (necesita respuesta del cliente)
ITEMS = [
    dict(
        n=1, start=16.26, short="Comprobante de pago",
        title="Interpretación de datos de comprobante",
        desc="La cliente envió el comprobante de pago y Sofi respondió: «No puedo ver el contenido de la imagen que enviaste».",
        tipo="Mejora", prio="Alta", fecha="12/10/2026",
        status="ok", stamp="Resuelto", chip="Resuelto", stamp_at=17.24,
        answer="Sofi ya no dice que no puede ver la imagen: confirma que la recibió y la deja pendiente de pago.",
    ),
    dict(
        n=2, start=45.36, short="Editar citas en agenda",
        title="Editar citas en agenda",
        desc="Permitir la corrección de los datos de fecha, hora y ciudad en el calendario.",
        tipo="Mejora", prio="Alta", fecha="12/10/2026",
        status="ask", stamp="Pregunta para ustedes", chip="Su respuesta", stamp_at=51.8,
        answer="Si editamos una cita, ¿hay que avisarle al cliente para que elija otra fecha, o el cambio queda entre ustedes?",
    ),
    dict(
        n=3, start=93.56, short="Agenda con datos restringidos",
        title="Visualización de agenda con datos restringidos",
        desc="Un acceso que solo vea fecha, hora, cliente y servicio, sin editar ni ver el número de contacto.",
        tipo="Mejora", prio="Alta", fecha="13/10/2026",
        status="ask", stamp="Por confirmar", chip="Por confirmar", stamp_at=160.56,
        answer="¿Es para roles como el de Alex, que opera en Sucre? ¿Solo en la app móvil? Cuéntennos la necesidad.",
        new_at=169.88, new_title="La agenda se sincroniza con Google Calendar",
        new_body="Se conecta en Integraciones y cada agenda elige su calendario.",
    ),
    dict(
        n=4, start=480.96, short="Sofi no está agendando bien",
        title="Sofi no está agendando bien",
        desc="Sesión f44d7042: agendó en otro horario.",
        tipo="Error", prio="Alta", fecha="14/10/2026",
        status="rev", stamp="Revisado", chip="Revisado", stamp_at=488.18,
        answer="Se agendó a las 5 p. m. y figura a las 5 p. m. en el agente, la web y la app: fue un falso positivo.",
    ),
    dict(
        n=5, start=505.5, short="Ir a la conversación desde la agenda",
        title="Poder ir a la conversación desde la agenda",
        desc="Un botón para ir a la conversación con el cliente sin copiar y pegar su número.",
        tipo="Mejora", prio="Alta", fecha="16/10/2026",
        status="ok", stamp="Resuelto", chip="Resuelto", stamp_at=508.9,
        answer="Nuevo botón «Ver detalles»: la cita y toda la conversación en una sola vista.",
        new_at=703.32, new_title="Crear citas desde la app móvil",
        new_body="Les enviaremos una nueva versión: desinstalen la anterior e instalen la nueva.",
    ),
    dict(
        n=6, start=717.46, short="Tiempo para enviar mensajes",
        title="Tiempo para enviar mensajes al cliente",
        desc="Sesión d3b4179a: no se pudo tomar control ni reactivar la conversación.",
        tipo="Error", prio="Alta", fecha="16/10/2026",
        status="ask", stamp="Necesitamos sus mensajes", chip="Sus mensajes", stamp_at=832.8,
        answer="Pasadas 24 horas, solo se puede reactivar con plantillas aprobadas por Meta. Envíennos 3 a 5 mensajes y los aprobamos.",
    ),
    dict(
        n=7, start=856.04, short="Nueva cita en lugar de reagendar",
        title="Que cree una nueva cita en lugar de reagendar",
        desc="La cliente pidió una nueva cita y el sistema primero le ofreció reagendar.",
        tipo="Error", prio="Alta", fecha="19/10/2026",
        status="ok", stamp="Resuelto", chip="Resuelto", stamp_at=862.12,
        answer="Sofi ya distingue entre una cita nueva y un reagendamiento.",
    ),
    dict(
        n=8, start=880.9, short="Límite de fecha en agenda",
        title="Límite de fecha en agenda por mensaje",
        desc="La agenda solo estaba abierta hasta cierta fecha límite.",
        tipo="Error", prio="Media", fecha="16/10/2026",
        status="ok", stamp="Resuelto", chip="Resuelto", stamp_at=896.58,
        answer="El límite pasó de 30 a 90 días, y cada agenda puede cambiarlo en su configuración.",
    ),
    dict(
        n=9, start=957.8, short="Siguiente sesión o reagendar",
        title="Diferencia entre agendar la siguiente sesión y reagendar",
        desc="Al pedir la siguiente sesión, Sofi reagendaba la cita ya registrada.",
        tipo="Error", prio="Media", fecha="16/10/2026",
        status="ok", stamp="Resuelto", chip="Resuelto", stamp_at=975.4,
        answer="Viene del mismo problema que el pedido 7: ya está corregido y probado.",
    ),
]

CLOSE_AT = 985.9
# Film second where the music bed ends (it goes quiet at 801.3 s; fade out before).
MUSIC_END = 801.2
# Pending items as Nicolás names them in the wrap-up.
CLOSE_CALLS = [(991.78, 2), (999.92, 3), (1028.18, 6)]

# App móvil (pedido 5): captions beside the phone.
MOVIL = dict(
    start=620.0, end=703.32,
    a_label="Pedido 5 · En el celular",
    a_title="«Ver detalles» y la conversación, también en la app",
    b_at=650.96, b_title="Crear citas desde la app móvil",
    b_body="La misma interfaz de la web: cliente, servicio, sede y horario.",
)

# Layout track. talk = cámara grande + tarjeta; screen = pantalla con la
# cámara chica (cx, cy, zoom sobre la grabación de 1920×1080); phone = la app
# móvil en el celular; close = lista final. Chapter starts insert a 2.6 s
# ledger beat automatically.
LAYOUT = [
    # Times taken from scene changes in the screen recording (ffmpeg scene > 0.06).
    (0.0, "talk"),
    (187.24, "screen", 960, 584, 1.0),    # Integraciones: sin zoom, se ve la sección nueva en el menú lateral
    (200.4, "screen", 1000, 600, 1.35),   # cuenta de Google y permisos
    (209.4, "screen", 960, 584, 1.0),     # Google Calendar conectado (con el menú lateral)
        (257.6, "screen", 960, 584, 1.0),     # va y viene entre Google Calendar y la agenda
    (272.1, "screen", 960, 600, 1.7),     # Nueva cita
    (295.9, "screen", 960, 584, 1.0),
    (303.0, "screen", 1600, 640, 1.5),    # en Google Calendar ya aparece la cita
    (316.3, "screen", 1620, 740, 2.0),    # y en la agenda, sincronizada
    (332.6, "screen", 960, 584, 1.0),
    (335.0, "screen", 960, 560, 1.35),    # crea «Estoy ocupado» en Google Calendar
    (341.0, "screen", 960, 584, 1.0),
    (344.0, "screen", 1640, 860, 1.8),    # el bloque oscuro en la agenda
    (370.3, "screen", 960, 584, 1.0),
    (376.0, "screen", 990, 550, 1.4),     # «Cita de Lucía» en Google Calendar
    (395.2, "screen", 960, 584, 1.0),
    (409.2, "screen", 960, 600, 1.6),     # Nueva cita (recomendado: crear desde acá)
    (415.8, "screen", 960, 584, 1.0),
    (454.9, "screen", 960, 600, 1.6),
    (460.8, "screen", 960, 584, 1.0),
    (466.2, "screen", 1360, 620, 1.4),
    (469.8, "screen", 960, 584, 1.0),
    (476.0, "talk"),
    (512.04, "screen", 960, 584, 1.0),    # agenda
    (533.8, "screen", 1066, 460, 1.7),    # pop-up con «Ver detalles»
    (536.3, "screen", 960, 584, 1.0),     # panel nuevo «Ver detalles»: sin zoom, se ve la barra con la X
    (563.8, "screen", 960, 584, 1.0),
    (566.1, "screen", 960, 584, 1.0),     # panel «Ver detalles» otra vez, completo
    (580.9, "screen", 960, 584, 1.0),
    (620.0, "phone"),
    (655.7, "screen", 960, 584, 1.0),     # «desde la web, es decir, desde acá»
    (661.3, "screen", 960, 600, 1.7),
    (663.7, "talk"),
    (666.6, "phone"),
    (703.32, "talk"),
    (772.4, "screen", 960, 584, 1.0),     # busca la conversación por ID
    (785.3, "screen", 1150, 600, 1.35),
    (832.0, "talk"),
    (898.8, "screen", 960, 584, 1.0),
    (925.4, "screen", 960, 584, 1.0),
    (935.5, "talk"),
    (CLOSE_AT, "close"),
]
