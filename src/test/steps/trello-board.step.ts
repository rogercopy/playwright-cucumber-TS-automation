import { setDefaultTimeout, Then, When } from "@cucumber/cucumber";
import { ICustomWorld } from "../support/custom-world";
import { expect } from "@playwright/test";
setDefaultTimeout(60 * 1000);

Then('Clear the closed boards', async function (this: ICustomWorld) {
    await this.pagesObj?.boardPage.clearClosedBoards();
});

Then('Close the {string} board', async function (this: ICustomWorld, boardName: string) {
    await this.pagesObj?.boardPage.closeBoard(boardName);
});

Then('Create a new board', async function (this: ICustomWorld) {
    await this.pagesObj?.boardPage.createNewBoard('NUS WayGate');
});

Then('Create the lists', async function (this: ICustomWorld) {
    const listNames = ['To-Do', 'In Progress', 'Waiting for review', 'Done'];
    await this.pagesObj?.boardPage.createLists(listNames);
});

When('Switch to Project Workspace', async function (this: ICustomWorld) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    await this.page?.screenshot({ path: 'screenshots/failure.png' });
    await this.pagesObj?.boardPage.switchToProjectWorkspace();
    await this.pagesObj?.boardPage.switchToBoard("NUS WayGate");
});

Then('Create the cards for respective lists', async function (this: ICustomWorld) {
    const ListNames = ['To-Do', 'In Progress', 'Waiting for review', 'Done'];
    const cardPrefixes = ['[DEV]', '[QA]', '[DEVOPS]'];
    for (const listName of ListNames) {
        const randomPrefix = cardPrefixes[Math.floor(Math.random() * cardPrefixes.length)];
        const taskNumber = Math.floor(Math.random() * 100) + 1;
        await this.pagesObj?.boardPage.createCard(listName, `${randomPrefix} Task ${taskNumber}`);
    }
});

Then('Mark The Card as complete and incomplete', async function (this: ICustomWorld) {
    await this.pagesObj?.boardPage.toggleCardCompletion('[QA]');
    await this.pagesObj?.boardPage.toggleCardCompletion('[QA]');
});

Then('Drag n Drop the card to another list', async function (this: ICustomWorld) {
    await this.pagesObj?.boardPage.dragAndDropCard('[DEVOPS] Task 60', 'Done');
});

Then('Create a checklist with task description', async function (this: ICustomWorld) {
    const checklistItems = [
        'Are Integration tests are passing',
        'Are Unit tests are passing?',
        'Verify PR checks',
        'Updated deps to latest versions?'
    ];
    await this.pagesObj?.boardPage.createChecklist('[DEVOPS] Task 60', 'Checklist', checklistItems);
});

Then('Complete the checklist items', async function (this: ICustomWorld) {
    const checklistItems = [
        'Are Integration tests are passing',
        'Are Unit tests are passing?',
        'Verify PR checks',
        'Updated deps to latest versions?'
    ];
    await this.pagesObj?.boardPage.completeChecklistItems('[DEVOPS] Task 60', checklistItems);
});

Then('Upload attachments to task', async function (this: ICustomWorld) {
    await this.pagesObj?.boardPage.uploadAttachment('[DEVOPS] Task 60', 'failure.png');
});

Then('Delete the attachment from task', async function (this: ICustomWorld) {
    await this.pagesObj?.boardPage.deleteAttachment('[DEVOPS] Task 60');
});

Then('Move task to the list of another board', async function (this: ICustomWorld) {
    await this.page?.getByLabel('my-trello-qa-test-board').click();
    const qaCard = await this.page?.getByRole('link', { name: '[QA] ' });
    if (qaCard) {
        await qaCard.click();
        await this.pagesObj?.boardPage.moveCardToList('[QA]', 'NUS WayGate', 'In Progress');
        await this.pagesObj?.boardPage.switchToBoard('NUS WayGate');
        expect(await this.page?.getByTestId('card-name').innerText()).toBe('[QA] Task moved successfully');
    }
});
