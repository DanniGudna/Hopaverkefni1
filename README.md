## Hópverkefni 1

# Upplýsingar um hvernig setja skuli upp verkefnið

## Hvernig gagnagrunnur og töflur eru settar upp og hvernig gögnum er komið inn í töflur

### Verkefnið sótt og sett upp
```bash
> git clone https://github.com/DanniGudna/Hopaverkefni1.git
> cd Hopverkefni1
> npm i
```
### Gagnagrunnur settur upp og gögn sett inn í hann
```bash
> node createdb.js
> node initdata.js
```

### Ræsa vefþjónustuna
```bash
> nodemon app.js
```

Núna hefur allt verið gert svo hægt sé að byrja að vinna með gögn, bæta við og breyta.


# Vefþjónustur

## Notendaskráning

### Stofna nýjan notanda

* `/register`
  - `POST` býr til notanda og skilar án lykilorðs hash. Það þarf að setja inn notendanafn, lykilorð og nafn á notanda á JSON formi.
  - Dæmi: 
  ```
  {
      "username": "<notendanafn>",
      "name": "<nafn-notanda>",
      "password": "<lykilord-notenda>"
  }
  ```

### Skrá sig inn í kerfið

* `/login`
  - `POST` skráir inn notanda og skilar tokeni.
  ```
    {
      "username": "<notendanafn>",
      "password": "<lykilord-notenda>"
    }
  ```



# Upplýsingar um notendur

## Sjá alla notendur

* `/users`
  - `GET` Skilar síðu af notendum 
  ```
  {
    "limit": 10,
    "offset": 0,
    "items": [
        {
            "id": 1,
            "username": "admin",
            "name": "",
            "image": null
        },
    ...
  ```

* `/users/:id`
  - `GET` Skilar síðu af einum notanda
  - Dæmi: /users/1
  ```
  {
    "id": 1,
    "username": "admin",
    "name": "",
    "image": null
  }
  ```

* `/users/me`
  - `GET` Skilar síðu af þeim notanda sem er skráður inn
  ```
  {
    "id": 62,
    "username": "dan",
    "name": "daniel",
    "image": null
  }
  ```

* `/users/me`
  - `PATCH` Uppfærir upplýsingar um notanda ef upplýsingar eru gildar
  ```
  {
    "name": "<nytt-nafn>"
  }
  ```

* `/users/me/profile`
  - `POST` Setur inn mynd fyrir notanda í gegnum Cloudinary. Uppfærir mynd ef mynd er núþegar til staðar.
  ```
  {
    "image": "<slod>"
  }
  ```

# Flokkar

## Sjá alla flokka í gagnagrunninum

* `/categories`
  - `GET` Skilar öllum flokkunum sem eru til í gagnagrunninum.
  ```
  {
    "limit": 10,
    "offset": 0,
    "items": [
        {
            "id": 1,
            "title": "Computer Science"
        },
        {
            "id": 2,
            "title": "Science Fiction"
        },
    ...
  }
  ```

## Setja inn nýjan flokk

* `/categories`
  - `POST` Setur inn mynd fyrir notanda í gegnum Cloudinary. Uppfærir mynd ef mynd er núþegar til staðar.
  - Dæmi
  ```
  {
	"title": "Bad Fantasy"
  }
  ```

  Skilar

  ```
  {
    "id": <númer-flokksins>,
    "title": "Bad Fantasy"
  }
  ```

# Bækur

## Sækja upplýsingar um allar bækurnar

* `/books`
  - `GET` Sækir upplýsingar um allar bækurnar í gagnagrunninum.
  ```
  {
    "limit": 10,
    "offset": 0,
    "items": [
        {
            "id": 1,
            "title": "1984",
            "author": "George Orwell",
            "description": "Winston Smith is a worker at the Ministry of Truth, where he falsifies records for the party. Secretly subversive, he and his colleague Julia try to free themselves from political slavery but the price of freedom is betrayal.",
            "isbn10": "451524934",
            "isbn13": "9780451524935",
            "category": 2,
            "published": "",
            "pagecount": "246",
            "language": "en"
        },
    }
    ...
  ```

## Býr til nýja bók

* `/books`
  - `POST` Býr til nýja bók ef öll gildin í BODY eru gild.
  ```
  {
    "title": "<strengur-krafist>",
    "author": "<strengur-ekki-krafist>",
    "description": "<strengur-ekki-krafist>",
    "isbn10": "<strengur-ekki-krafist>",
    "isbn13": "<strengur-krafist>",
    "category": <strengur-krafist>,
    "published": "<strengur-ekki-krafist>",
    "pagecount": "<heiltala-ekki-krafist>",
    "language": "<strengur-ekki-krafist>"
  }
  ```

## Leita af bók

* `/books?search=query`
  - `GET` Skilar niðurstöðum af bókum sem uppfylla skilyrði.
  - Dæmi: /book?search=1984
  ```
  {
    "limit": 10,
    "offset": 0,
    "items": [
        {
            "id": 1,
            "title": "1984",
            "author": "George Orwell",
            "description": "Winston Smith is a worker at the Ministry of Truth, where he falsifies records for the party. Secretly subversive, he and his colleague Julia try to free themselves from political slavery but the price of freedom is betrayal.",
            "isbn10": "451524934",
            "isbn13": "9780451524935",
            "category": 2,
            "published": "",
            "pagecount": "246",
            "language": "en"
        }
    ]
  }
  ```

  ## Leita af bók frá ID

* `/books/:id`
  - `GET` Skilar upplýsingum um ákveðna bók út frá ID
  - Dæmi: /books/2
  ```
  {
    "id": 2,
    "title": "1Q84",
    "author": "Haruki Murakami",
    "description": "The internationally best-selling and award-winning author of such works as What I Talk About When I Talk About Running presents a psychologically charged tale that draws on Orwellian themes. 100,000 first printing.",
    "isbn10": "307593312",
    "isbn13": "9780307593313",
    "category": 11,
    "published": "2011",
    "pagecount": "925",
    "language": "en"
  }
  ```

  ## Uppfæra bók frá ID

* `/books/:id`
  - `PATCH` Uppfærir upplýsingar um bók mv. þeim upplýsingum sem eru gefnar.
  - Dæmi: /books/2
  ```
  {
    "author": "Sensei Haruki Murakami",
    "published": "2010",
    "language": "is"
  }
  ```
  - Skilar
  ```
  {
    "id": 2,
    "title": "1Q84",
    "author": "Sensei Haruki Murakami",
    "description": "The internationally best-selling and award-winning author of such works as What I Talk About When I Talk About Running presents a psychologically charged tale that draws on Orwellian themes. 100,000 first printing.",
    "isbn10": "307593312",
    "isbn13": "9780307593313",
    "category": 11,
    "published": "2010",
    "pagecount": "925",
    "language": "is"
  }
  ```


# Bókalestur

## Lestur ákveðins notanda

* `/users/:id/read`
  - `GET` Sækir bækur sem notandi <:id> hefur lesið.
  - Dæmi: /user/62/read
  ```
  {
    "limit": 10,
    "offset": 0,
    "items": [
        {
            "id": 6,
            "book_id": 1,
            "user_id": 62,
            "rating": 5,
            "review": ""
        },
        {
            "id": 7,
            "book_id": 2,
            "user_id": 62,
            "rating": 5,
            "review": "5/7"
        }
    ]
  }
  ```

## Lestur innskráðs notanda

* `/users/me/read`
  - `GET` Skilar lista af bókum sem innskráður notandu hefur lesið.
  ```
  {
    "limit": 10,
    "offset": 0,
    "items": [
        {
            "id": 6,
            "book_id": 1,
            "user_id": 62,
            "rating": 5,
            "review": ""
        },
        {
            "id": 7,
            "book_id": 2,
            "user_id": 62,
            "rating": 5,
            "review": "5/7"
        }
    ]
  }
  ```


* `/users/me/read`
  - `POST` Skrár inn bók sem notandi hefur lesið
  ```
  {
    "bookId": <heiltala-krafist>,
    "rating": <heiltala-krafist(1-5)>,
    "review": <strengur-ekki-krafist>
  }
  ```
  - Dæmi
  ```
  {
    "bookId": 2,
    "rating": 5,
    "review": "5/7"
  }
  ```

  - Skilar
  ```
  {
    "id": <id-umfjöllunar>,
    "book_id": 2,
    "user_id": <id-notanda>,
    "rating": 5,
    "review": "5/7"
  }
  ```
* `/users/me/read/:id`
  - `DELETE` Eyðir bók út af lestra-listra
  - Dæmi: /user/me/read/20
  ```
  {
    "limit": 10,
    "offset": 0,
    "items": [
        {
            "id": 6,
            "book_id": 1,
            "user_id": 62,
            "rating": 5,
            "review": ""
        },
        {
            "id": 7,
            "book_id": 2,
            "user_id": 62,
            "rating": 5,
            "review": "5/7"
        }
    ]
  }
  ```


# Nemendur

## Alexander Freyr Sveinsson
### 
## Daníel Guðnason
### 
## Daníel Ingólfsson
### dai5@HÁ Í