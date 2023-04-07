package migrations

import (
	"encoding/json"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/daos"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/models"
)

func init() {
	m.Register(func(db dbx.Builder) error {
		jsonData := `[
			{
				"id": "_pb_users_auth_",
				"created": "2023-03-26 13:16:52.676Z",
				"updated": "2023-04-07 01:28:22.808Z",
				"name": "users",
				"type": "auth",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "users_name",
						"name": "name",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "6qeeqrgb",
						"name": "role",
						"type": "select",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"admin",
								"chef",
								"cocinero",
								"sala"
							]
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": "",
				"options": {
					"allowEmailAuth": true,
					"allowOAuth2Auth": true,
					"allowUsernameAuth": true,
					"exceptEmailDomains": null,
					"manageRule": null,
					"minPasswordLength": 8,
					"onlyEmailDomains": null,
					"requireEmail": false
				}
			},
			{
				"id": "i10istkb36rfzis",
				"created": "2023-03-26 16:28:46.481Z",
				"updated": "2023-03-26 17:57:01.618Z",
				"name": "categories",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "d7yhipmz",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": "",
				"options": {}
			},
			{
				"id": "87aciqtc2mzpe0v",
				"created": "2023-03-26 16:31:15.627Z",
				"updated": "2023-03-29 04:49:07.678Z",
				"name": "ingredients",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "3uw6ycur",
						"name": "name",
						"type": "text",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "fq5qptrm",
						"name": "category",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "i10istkb36rfzis",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": [
								"name"
							]
						}
					},
					{
						"system": false,
						"id": "lq1plcld",
						"name": "weight",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "ts05y1uk",
						"name": "weight_type",
						"type": "select",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"ml",
								"gr"
							]
						}
					},
					{
						"system": false,
						"id": "te4u6hlu",
						"name": "quantity",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "ybjqd3iu",
						"name": "expirationDate",
						"type": "date",
						"required": false,
						"unique": false,
						"options": {
							"min": "",
							"max": ""
						}
					},
					{
						"system": false,
						"id": "5wvyslh4",
						"name": "cooled",
						"type": "bool",
						"required": false,
						"unique": false,
						"options": {}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": "",
				"options": {}
			},
			{
				"id": "g92yie50s2xus77",
				"created": "2023-03-26 16:53:13.613Z",
				"updated": "2023-04-05 20:26:26.529Z",
				"name": "dishes",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "gp6wdhlf",
						"name": "name",
						"type": "text",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null,
							"pattern": ""
						}
					},
					{
						"system": false,
						"id": "awb5nuxp",
						"name": "image",
						"type": "file",
						"required": false,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"maxSize": 5242880,
							"mimeTypes": [
								"image/png",
								"image/jpeg",
								"image/svg+xml",
								"image/bmp",
								"image/webp"
							],
							"thumbs": [
								"128x128"
							]
						}
					},
					{
						"system": false,
						"id": "gd2wo0gm",
						"name": "description",
						"type": "editor",
						"required": false,
						"unique": false,
						"options": {}
					},
					{
						"system": false,
						"id": "dc8t7j7y",
						"name": "ingredients",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "qya5v5x5z7m2ahz",
							"cascadeDelete": false,
							"minSelect": null,
							"maxSelect": null,
							"displayFields": [
								"ingredient"
							]
						}
					},
					{
						"system": false,
						"id": "2fqi8mpy",
						"name": "disabled",
						"type": "bool",
						"required": false,
						"unique": false,
						"options": {}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": "",
				"options": {}
			},
			{
				"id": "qya5v5x5z7m2ahz",
				"created": "2023-03-26 17:20:10.702Z",
				"updated": "2023-03-29 10:20:29.192Z",
				"name": "dishes_ingredients",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "gncda5qk",
						"name": "ingredient",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "87aciqtc2mzpe0v",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": [
								"name"
							]
						}
					},
					{
						"system": false,
						"id": "zmqbx5o6",
						"name": "weight",
						"type": "number",
						"required": false,
						"unique": false,
						"options": {
							"min": 0,
							"max": null
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": "",
				"options": {}
			},
			{
				"id": "q4kc2tdgnwlc4b1",
				"created": "2023-03-29 05:45:11.176Z",
				"updated": "2023-03-29 10:19:33.357Z",
				"name": "inventory_items",
				"type": "base",
				"system": false,
				"schema": [
					{
						"system": false,
						"id": "nyj7zs5l",
						"name": "ingredient",
						"type": "relation",
						"required": false,
						"unique": false,
						"options": {
							"collectionId": "87aciqtc2mzpe0v",
							"cascadeDelete": true,
							"minSelect": null,
							"maxSelect": 1,
							"displayFields": [
								"name"
							]
						}
					},
					{
						"system": false,
						"id": "utc2h2n4",
						"name": "quantity",
						"type": "number",
						"required": true,
						"unique": false,
						"options": {
							"min": null,
							"max": null
						}
					},
					{
						"system": false,
						"id": "ivwwoxhe",
						"name": "type",
						"type": "select",
						"required": true,
						"unique": false,
						"options": {
							"maxSelect": 1,
							"values": [
								"entry",
								"exit"
							]
						}
					}
				],
				"listRule": "",
				"viewRule": "",
				"createRule": "",
				"updateRule": "",
				"deleteRule": "",
				"options": {}
			}
		]`

		collections := []*models.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collections); err != nil {
			return err
		}

		return daos.New(db).ImportCollections(collections, true, nil)
	}, func(db dbx.Builder) error {
		return nil
	})
}
