GET /properties
[
    {
        id: "507f191e810c19729de860ea",
        nApat: 502,
        complex: "Mogan",
        surname: "West",
        booked: {
            2023: {
                january: {
                    ["2023-01-01", "2023-01-15", 0],
                    ["2023-01-16", "2023-01-23", 1],
                    ["2023-01-24", "2023-01-31", 2]
                },
                february: {
                    "blocked": [{"from": "2023-02-01", "to": "2023-02-05"}, {"from": "2023-02-06", "to": "2023-02-28"}],
                    "booked": [{"from": "2023-02-01", "to": "2023-02-05"}, {"from": "2023-02-06", "to": "2023-02-28"}]
                }
            }
        }
    }
]

consideraciones: la cantidad de propiedades seran como max 350. 
El arreglo de properties no debe ser paginado, debe ser completo. 
Pero considerar que a futuro se podria hacer el request en mas de 1 vez o paginar 
(aunque paginado no fue elegido por el cliente)

// ---------------------------------------------

POST /properties

{
    nApat: 502,
    complex: "Mogan",
    surname: "West",
}

validaciones:  que ("nApart","complex") sean unicos

return {
    id: "507f191e810c19729de860ea",
    nApat: 502,
    complex: "Mogan",
    surname: "West",
}

// ---------------------------------------------

PATCH /properties/:id
{
    nApat: 502,
    complex: "Puerto Rico",
    surname: "West",
}
validaciones: que "id" exista + que ("nApart","complex") sean unicos

return ?

// ---------------------------------------------

POST /property/:id/book

{
    "from": "2023-01-01",
    "to": "2023-01-15",
    "status": 0 // o "blocked"
}

0 -> "blocked", "red"
1 -> "booked", "green"
2 -> "available", "white"

validaciones: 
- que "id" exista 
- que "from", "to" sean validas (sean fechas con formato "YYYY-MM-DD" y que "from" sea menor que "to" y que no se solapen con otras reservas)
- que "status" sea valido (0, 1, 2 por ejemplo)

// ---------------------------------------------

DELETE /property/:id/book

{
  "from": "01/01/2023",
  "to": "15/01/2023",
}

validaciones: 
- que el "id" exista
- que las fechas sean validas (que from < to, y que sea un rango de fechas existentes en la bbdd)