# Storyboard: Arquitectura del Agente ReAct

**Objetivo:** Explicar el patrón ReAct (Reasoning and Acting) en agentes de IA, basándonos en el diagrama proporcionado, mostrando cómo el modelo iterativamente piensa, actúa y observa antes de dar una respuesta final.
**Estilo Visual:** Dibujo a mano alzada (estilo pizarra o *sketch*), colores pastel (como en el diagrama original). Animación fluida de líneas y aparición de elementos por partes.

---

## Escena 1: Introducción al Patrón ReAct
* **Duración:** 5 segundos
* **Visual:** Pantalla en blanco. Se dibuja rápidamente el título superior: **"ReAct Agent architecture"** con una tipografía estilo máquina de escribir o manuscrita.
* **Audio (Voice Over - VO):** "Los modelos de lenguaje son inteligentes, pero para resolver problemas complejos del mundo real, necesitan algo más que solo hablar. Necesitan el patrón ReAct: Razonar y Actuar."

## Escena 2: El Estímulo (La Pregunta)
* **Duración:** 6 segundos
* **Visual:** Aparece desde arriba, con un efecto de rebote (*pop-up*), el icono naranja con la **"Q"**. Luego, se despliega a su lado la burbuja roja que dice **"Query"**. Se dibuja una flecha negra sólida apuntando hacia abajo.
* **Audio (VO):** "Todo comienza con un 'Query' o consulta del usuario. Una pregunta compleja que el agente no puede responder solo con su memoria interna."

## Escena 3: El Razonamiento (Thinking)
* **Duración:** 8 segundos
* **Visual:** La flecha del 'Query' llega al centro. Se dibuja el rombo verde. Sobre él, cae un pequeño icono de un cerebro rosa palpitante (**"brain"**). Aparece el texto **"Thinking"** dentro del rombo. El cerebro brilla sutilmente.
* **Audio (VO):** "La consulta llega al núcleo del agente. Aquí ocurre el 'Razonamiento'. El agente analiza la pregunta paso a paso y decide qué necesita hacer a continuación para encontrar la verdad."

## Escena 4: La Acción y la Herramienta (Action & Tool)
* **Duración:** 9 segundos
* **Visual:** El cerebro deja de brillar. Se dibuja una línea punteada (**"Action"**) que sale del rombo verde hacia la parte inferior izquierda. Al final de la flecha, aparece el cuadro gris claro **"Tool"** con los iconos del destornillador y la llave inglesa. Los engranajes o herramientas se animan brevemente (como si estuvieran trabajando).
* **Audio (VO):** "Si el agente determina que le falta información, decide tomar una 'Acción'. Llama a una herramienta externa, como un buscador web, una calculadora o una base de datos corporativa."

## Escena 5: La Observación (El Bucle)
* **Duración:** 7 segundos
* **Visual:** Del cuadro "Tool" sale una flecha curva sólida hacia arriba. En el medio del trayecto aparece el texto **"Observation"**. La flecha termina de vuelta en el rombo verde ("Thinking"). El cerebro vuelve a palpitar.
* **Audio (VO):** "La herramienta devuelve un resultado, lo que llamamos 'Observación'. El agente recibe estos nuevos datos, los integra en su razonamiento y vuelve a pensar."

## Escena 6: La Iteración (Opcional - Énfasis del patrón)
* **Duración:** 6 segundos
* **Visual:** Las flechas de *Action* y *Observation* se iluminan rápidamente en secuencia circular (Thinking -> Tool -> Thinking), demostrando que este ciclo puede repetirse varias veces.
* **Audio (VO):** "Este ciclo de Pensar, Actuar y Observar se repite tantas veces como sea necesario hasta que el agente reúne toda la información correcta."

## Escena 7: La Resolución (Finish & Answer)
* **Duración:** 7 segundos
* **Visual:** El bucle se detiene. Se dibuja una línea punteada (**"Finish"**) que sale del rombo verde hacia la esquina inferior derecha. Aparece el cuadro amarillo **"Answer"** y a su lado la burbuja amarilla con la **"A"**.
* **Audio (VO):** "Una vez que el agente concluye su razonamiento y tiene la certeza de la respuesta, toma la acción de 'Finalizar'. Es entonces cuando entrega la respuesta final, precisa y fundamentada, al usuario."

## Escena 8: Cierre
* **Duración:** 4 segundos
* **Visual:** El diagrama completo queda en pantalla (`image_255b07.png`). Se resalta ligeramente el cerebro y las herramientas. Fade out a negro o logo de la empresa.
* **Audio (VO):** "Arquitectura ReAct: Dándole a la IA la capacidad de pensar antes de actuar."