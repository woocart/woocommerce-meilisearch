<p align="center">
  <img src="https://res.cloudinary.com/meilisearch/image/upload/v1587402338/SDKs/meilisearch_php.svg" alt="MeiliSearch-PHP" width="200" height="200" />
</p>

<h1 align="center">MeiliSearch PHP</h1>

<h4 align="center">
  <a href="https://github.com/meilisearch/MeiliSearch">MeiliSearch</a> |
  <a href="https://www.meilisearch.com">Website</a> |
  <a href="https://blog.meilisearch.com">Blog</a> |
  <a href="https://twitter.com/meilisearch">Twitter</a> |
  <a href="https://docs.meilisearch.com">Documentation</a> |
  <a href="https://docs.meilisearch.com/faq">FAQ</a>
</h4>

<p align="center">
  <a href="https://packagist.org/packages/meilisearch/meilisearch-php"><img src="https://img.shields.io/packagist/v/meilisearch/meilisearch-php" alt="Latest Stable Version"></a>
  <a href="https://github.com/meilisearch/meilisearch-php/actions"><img src="https://github.com/meilisearch/meilisearch-php/workflows/Tests/badge.svg" alt="Test"></a>
  <a href="https://github.com/meilisearch/meilisearch-php/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-informational" alt="License"></a>
  <a href="https://slack.meilisearch.com"><img src="https://img.shields.io/badge/slack-MeiliSearch-blue.svg?logo=slack" alt="Slack"></a>
</p>

<p align="center">⚡ Lightning Fast, Ultra Relevant, and Typo-Tolerant Search Engine MeiliSearch client written in PHP</p>

**MeiliSearch PHP** is a client for **MeiliSearch** written in PHP. **MeiliSearch** is a powerful, fast, open-source, easy to use and deploy search engine. Both searching and indexing are highly customizable. Features such as typo-tolerance, filters, and synonyms are provided out-of-the-box.

## Table of Contents <!-- omit in toc -->

- [🔧 Installation](#-installation)
- [🚀 Getting started](#-getting-started)
- [🤖 Compatibility with MeiliSearch](#-compatibility-with-meilisearch)
- [📖 Documentation and Examples](#-documentation-and-examples)
- [🧰 HTTP Client Compatibilities](#-http-client-compatibilities)
  - [Customize your HTTP Client](#customize-your-http-client)
- [⚙️ Development Workflow and Contributing](#️-development-workflow-and-contributing)

## 🔧 Installation

To get started, simply require the project using [Composer](https://getcomposer.org/).<br>
You will also need to install packages that "provide" [`psr/http-client-implementation`](https://packagist.org/providers/psr/http-client-implementation) and [`psr/http-factory-implementation`](https://packagist.org/providers/psr/http-factory-implementation).<br>
A list with compatible HTTP clients and client adapters can be found at [php-http.org](http://docs.php-http.org/en/latest/clients.html).

**If you don't know which HTTP client to use, we recommend using Guzzle 7**:

```bash
$ composer require meilisearch/meilisearch-php guzzlehttp/guzzle http-interop/http-factory-guzzle:^1.0
```

Here is an example of installation with the `symfony/http-client`:

```bash
$ composer require meilisearch/meilisearch-php symfony/http-client nyholm/psr7:^1.0
```

💡 *More HTTP client installations compatible with this package can be found [in this section](#-http-client-compatibilities).*

### Run MeiliSearch <!-- omit in toc -->

There are many easy ways to [download and run a MeiliSearch instance](https://docs.meilisearch.com/guides/advanced_guides/installation.html#download-and-launch).

For example, if you use Docker:
```bash
$ docker pull getmeili/meilisearch:latest # Fetch the latest version of MeiliSearch image from Docker Hub
$ docker run -it --rm -p 7700:7700 getmeili/meilisearch:latest ./meilisearch --master-key=masterKey
```

NB: you can also download MeiliSearch from **Homebrew** or **APT**.

## 🚀 Getting started

#### Add documents <!-- omit in toc -->

```php
<?php

require_once __DIR__ . '/vendor/autoload.php';

use MeiliSearch\Client;

$client = new Client('http://127.0.0.1:7700', 'masterKey');
$index = $client->createIndex('books'); // If your index does not exist
$index = $client->getIndex('books');    // If you already created your index

$documents = [
    ['book_id' => 123,  'title' => 'Pride and Prejudice', 'author' => 'Jane Austen'],
    ['book_id' => 456,  'title' => 'Le Petit Prince', 'author' => 'Antoine de Saint-Exupéry'],
    ['book_id' => 1,    'title' => 'Alice In Wonderland', 'author' => 'Lewis Carroll'],
    ['book_id' => 1344, 'title' => 'The Hobbit', 'author' => 'J. R. R. Tolkien'],
    ['book_id' => 4,    'title' => 'Harry Potter and the Half-Blood Prince', 'author' => 'J. K. Rowling'],
    ['book_id' => 42,   'title' => 'The Hitchhiker\'s Guide to the Galaxy', 'author' => 'Douglas Adams, Eoin Colfer, Thomas Tidholm'],
];

$index->addDocuments($documents); // => { "updateId": 0 }
```

With the `updateId`, you can check the status (`processed` or `failed`) of your documents addition thanks to this [method](https://docs.meilisearch.com/references/updates.html#get-an-update-status).


#### Basic search <!-- omit in toc -->

```php
// MeiliSearch is typo-tolerant:
print_r($index->search('harry pottre'));
```
Output:
```php
Array
(
    [hits] => Array
        (
            [0] => Array
                (
                    [id] => 4
                    [title] => Harry Potter and the Half-Blood Prince
                )

        )

    [offset] => 0
    [limit] => 20
    [processingTimeMs] => 1
    [query] => harry pottre
)
```

#### Custom search <!-- omit in toc -->

All the supported options are described in [this documentation section](https://docs.meilisearch.com/references/search.html#search-in-an-index).

```php
$index->search('prince', ['limit' => 1]);
```

```json
{
    "hits": [
        {
            "book_id": 456,
            "title": "Le Petit Prince"
        }
    ],
    "offset": 0,
    "limit": 1,
    "processingTimeMs": 10,
    "query": "prince"
}
```

With limit and filter, both single and double quotes are supported.
```php
// Enclosing with double quotes
$index->search('prince', ['limit' => 2, 'filters' => "title = 'Le Petit Prince' OR author = 'J. R. R. Tolkien'"]);

// Enclosing with single quotes
$index->search('hobbit', ['limit' => 2, 'filters' => 'title = "The Hitchhiker\'s Guide to the Galaxy" OR author = "J. R. R. Tolkien"']);
```

## 🤖 Compatibility with MeiliSearch

This package only guarantees the compatibility with the [version v0.15.0 of MeiliSearch](https://github.com/meilisearch/MeiliSearch/releases/tag/v0.15.0).

## 📖 Documentation and Examples

MeiliSearch documentation provides **examples** and a detailed explanation of every one of its features and functionalities, including examples on how to implement them **using this SDK**.

Please read the [guides available in the documentation](https://docs.meilisearch.com/guides/) or check the [API references](https://docs.meilisearch.com/references/) to find the one that you need!

The following sections may interest you:

- [Manipulate documents](https://docs.meilisearch.com/references/documents.html)
- [Search](https://docs.meilisearch.com/references/search.html)
- [Manage the indexes](https://docs.meilisearch.com/references/indexes.html)
- [Configure the index settings](https://docs.meilisearch.com/references/settings.html)

## 🧰 HTTP Client Compatibilities

You could use any [PSR-18](https://www.php-fig.org/psr/psr-18/) compatible client to use with this SDK. No additional configurations are required.<br>
A list of compatible HTTP clients and client adapters can be found at [php-http.org](http://docs.php-http.org/en/latest/clients.html).

If you want to use this `meilisearch-php`:

- with `guzzlehttp/guzzle` (Guzzle 7), run:

```bash
$ composer require meilisearch/meilisearch-php guzzlehttp/guzzle http-interop/http-factory-guzzle:^1.0
```

- with `php-http/guzzle6-adapter` (Guzzle < 7), run:

```bash
$ composer require meilisearch/meilisearch-php php-http/guzzle6-adapter:^2.0 http-interop/http-factory-guzzle:^1.0
```

- with `symfony/http-client`, run:

```bash
$ composer require meilisearch/meilisearch-php symfony/http-client nyholm/psr7:^1.0
```

- with `php-http/curl-client`, run:

```bash
$ composer require meilisearch/meilisearch-php php-http/curl-client nyholm/psr7:^1.0
```

- with `kriswallsmith/buzz`, run:

```bash
$ composer require meilisearch/meilisearch-php kriswallsmith/buzz nyholm/psr7:^1.0
```

### Customize your HTTP Client

For some reason, you might want to pass a custom configuration to your own HTTP client.<br>
Make sure you have a [PSR-18](https://www.php-fig.org/psr/psr-18/) compatible client when you initialize the MeiliSearch client.

Following the example in the [Getting Started](#-getting-started) section, with the Guzzle HTTP client:

```php
new Client('http://127.0.0.1:7700', 'masterKey', new GuzzleHttpClient(['timeout' => 2]));
```

## ⚙️ Development Workflow and Contributing

Any new contribution is more than welcome in this project!

If you want to know more about the development workflow or want to contribute, please visit our [contributing guidelines](/CONTRIBUTING.md) for detailed instructions!

<hr>

**MeiliSearch** provides and maintains many **SDKs and Integration tools** like this one. We want to provide everyone with an **amazing search experience for any kind of project**. If you want to contribute, make suggestions, or just know what's going on right now, visit us in the [integration-guides](https://github.com/meilisearch/integration-guides) repository.
