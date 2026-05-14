import { Given, When, Then, setDefaultTimeout, BeforeAll } from '@cucumber/cucumber';
import { expect, request, APIResponse, APIRequestContext } from '@playwright/test';
import { key, token, trelloBoardId, trelloBoardListId, trelloApiHost} from '../utils/constants';

let context: APIRequestContext;
let response: APIResponse;
let listId: string;
let listName: string;

setDefaultTimeout(60000); // Set a default timeout of 60 seconds

BeforeAll(async () => {
    context = await request.newContext({
        baseURL: trelloApiHost,
    });
})

Given('Send Get Request to {string}', async function (endpoint) {
    response = await context.get(endpoint, {
        headers: {
            'Accept': 'application/json',
        },
    });
});

Given('Send POST Request to create a new board as {string}', async function (boardName) {
    response = await context.post(`/1/boards/?key=${key}&token=${token}`, {
        headers: {
        },
        params: {
            name: boardName,
        },
    });

    const res = await response.json();
    this.boardId = res.id;
});


When('Send PUT Request to update the board to {string}', async function (updatedName) {
    response = await context.put(`/1/boards/${this.boardId}?key=${key}&token=${token}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' // Important for PUT requests with a body
        },
        data: {
            name: updatedName,
        },
    });
});

When('Send Delete Request to the board', async function () {
    response = await context.delete(`/1/boards/${this.boardId}?key=${key}&token=${token}`, {
        headers: {
        },
        data: {
        },
    });
});

Given('Send Get Request with board id to retrieve the Lists', async () => {
    const id = trelloBoardId;
    response = await context.get(`/1/boards/${id}/lists?key=${key}&token=${token}`, {
        headers: {
            'Accept': 'application/json',
        },
    })
})

Then('The response should contain valid lists with id and name', async function () {
    const responseBody = await response.json();

    expect(responseBody).toBeInstanceOf(Array); // Ensure response is an array
    expect(responseBody.length).toBeGreaterThan(0); // Ensure it's not empty

    responseBody.forEach((list: { id: string; name: string }) => {
        expect(list).toHaveProperty('id');
        expect(typeof list.id).toBe('string');
        expect(list.id.length).toBeGreaterThan(5);

        expect(list).toHaveProperty('name');
        expect(typeof list.name).toBe('string');
        expect(list.name.length).toBeGreaterThan(1);
    });
});

When('Send Get Request with valid list id to get a list', async function () {
    const responseBody = await response.json();
    listId = responseBody[0].id;
    listName = responseBody[0].name;

    response = await context.get(`/1/lists/${listId}?key=${key}&token=${token}`)
});

Then('the response should contain a list with id and name', async () => {
    const res = await response.json();
    expect(res.id).toBe(listId);
    expect(res.name).toBe(listName);
})

Given('Send POST request to Create a new list as {string}', async function (listName: string) {
    response = await context.post(`/1/lists?key=${key}&token=${token}`, {
        params: {
            'idBoard': trelloBoardId,
            'name': listName
        }
    })
});

Given('Send PUT request to update the list name to {string}', async (listName: string) => {
    const responseBody = await response.json();
    const listId = responseBody.id;

    response = await context.put(`/1/lists/${listId}?key=${key}&token=${token}`, {
        params: {
            'name': listName
        }
    })
})

Given('Send PUT request to archive a list', async () => {
    const responseBody = await response.json();
    const listId = responseBody.id;

    response = await context.put(`/1/lists/${listId}/closed?key=${key}&token=${token}`, {
        params: {
            'value': true
        }
    })
})

Then('the response should contain list id property and name as {string}', async function (listName: string) {
    const res = await response.json();
    expect(res).toHaveProperty('id');
    expect(res).toHaveProperty('name', listName);
});

Given('Send Post Request to create a new card in the list as {string}', async function (cardName) {
    response = await context.post(`/1/cards?key=${key}&token=${token}`, {
        params: {
            'name': cardName,
            'idList': trelloBoardListId
        }
    })
});

Given('Send Get Request to retrieve the card from the list', async function () {
    const res = await response.json();
    const cardId = res.id;

    response = await context.get(`/1/cards/${cardId}?key=${key}&token=${token}`, {
        'headers': {
            'Accept': 'application/json'
        }
    })
});

Then('expect the response to contain id property and name property as {string}', async function (cardName) {
    const res = await response.json();
    expect(res).toHaveProperty('id');
    expect(res).toHaveProperty('name', cardName)
});

Given('Send Put Request to update the name of card from the list as {string}', async function (updatedCardName) {
    const res = await response.json();
    const cardId = res.id;

    response = await context.put(`/1/cards/${cardId}?key=${key}&token=${token}`, {
        'params': {
            'name': updatedCardName
        },
        'headers': {
            'Accept': 'application/json'
        }
    })
});

Given('Send Delete Request to delete the card from the list', async function () {
    const res = await response.json();
    const cardId = res.id;

    response = await context.delete(`/1/cards/${cardId}?key=${key}&token=${token}`)
});

Then('the response status code should be {int}', async function (statusCode) {
    expect(response.status()).toBe(statusCode);
});

Then('the response should be in JSON format', async function () {
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
});

Then('the board name should be updated to {string}', async function (expectedName) {
    const data = await response.json();
    expect(data.name).toBe(expectedName);
});