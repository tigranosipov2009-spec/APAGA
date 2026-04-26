# АПАГА — сайт строительной компании

Статический сайт (HTML/CSS/JS), готов к публикации на GitHub Pages.

## Структура

```
.
├── index.html              # главная
├── about.html              # о компании
├── portfolio.html          # портфолио
├── contact.html            # контакты
├── services/               # страницы услуг
│   ├── monolit.html
│   ├── fasad.html
│   ├── otdelka.html
│   └── seti.html
├── assets/
│   ├── css/main.css
│   ├── js/main.js
│   └── img/                # logo, icons sprite
├── pf/                     # слайды портфолио (jpg)
├── portfolio_imgs/         # исходные фото объектов
└── .nojekyll               # отключает Jekyll-обработку GitHub Pages
```

Все пути в HTML — относительные (`assets/...` для корневых страниц, `../assets/...` для `services/*`). Никаких абсолютных `/path` нет.

## Локальный запуск

```bash
# Python 3
python -m http.server 8000
# открыть http://localhost:8000
```

## Деплой на GitHub Pages

1. Создать репозиторий на GitHub.
2. Запушить проект:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```

3. В репозитории: **Settings → Pages → Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: **main** / folder **/ (root)**
   - Сохранить.

4. Через 1–2 минуты сайт будет доступен по адресу:
   `https://<user>.github.io/<repo>/`

## Заметки

- Файл `.nojekyll` в корне — обязателен, чтобы GitHub Pages не пытался обрабатывать сайт через Jekyll и не игнорировал папки/файлы с `_` или другими спецсимволами.
- Папки `portfolio_imgs2/`, `portfolio_pages/`, `portfolio_p1-30.txt` — рабочие артефакты, не используются на сайте. Можно удалить перед публикацией для уменьшения размера репозитория.
- Если разворачиваете в подпапке (например, `username.github.io/apaga/`), все ссылки уже относительные — работать будет без правок.
