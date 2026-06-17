import { BrowserContext, Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class BoardPage extends BasePage {
    // Board Creation Locators
    readonly createBoardButton: Locator;
    readonly backgroundButton: Locator;
    readonly photosButton: Locator;
    readonly boardTitleInput: Locator;
    readonly createBoardSubmitButton: Locator;
    // List Locators
    readonly listComposerButton: Locator;
    readonly listNameInput: Locator;
    readonly addListButton: Locator;

    // Card Locators
    readonly cardTitleInput: Locator;
    readonly addCardButton: Locator;
    readonly cardDoneButton: Locator;

    // Checklist Locators
    readonly checklistButton: Locator;
    readonly checklistTitleInput: Locator;
    readonly addChecklistButton: Locator;
    readonly checklistItemInput: Locator;
    readonly addChecklistItemButton: Locator;
    readonly cancelChecklistButton: Locator;
    readonly checklistProgressPercentage: Locator;

    // Card Details Locators
    readonly descriptionButton: Locator;
    readonly descriptionInput: Locator;
    readonly descriptionSaveButton: Locator;
    readonly addToCardButton: Locator;
    readonly attachmentButton: Locator;
    readonly chooseFileButton: Locator;
    readonly deleteAttachmentButton: Locator;
    readonly confirmDeleteButton: Locator;
    readonly moveCardButton: Locator;
    readonly moveCardBoardSelect: Locator;
    readonly moveCardListSelect: Locator;
    readonly moveCardSubmitButton: Locator;

    // Board Close Locators
    readonly closeBoardButton: Locator;
    readonly closeBoardMenuButton: Locator;
    readonly confirmCloseBoardButton: Locator;
    readonly deleteBoardButton: Locator;
    readonly confirmDeleteBoardButton: Locator;
    readonly viewClosedBoardsBtn: Locator;

    constructor(page: Page, context: BrowserContext) {
        super(page, context);

        // Initialize Board Creation Locators
        this.createBoardButton = page.locator('span').getByText('Create new board');
        this.backgroundButton = page.locator('.nch-icon.A3PtEe1rGIm_yL.neoUEAwI0GETBQ.LCBkZyEuShKn0r');
        this.photosButton = page.locator('header').filter({ hasText: 'PhotosSee more' }).getByRole('button');
        this.boardTitleInput = page.getByTestId('create-board-title-input');
        this.createBoardSubmitButton = page.getByTestId('create-board-submit-button');
        // Initialize List Locators
        this.listComposerButton = page.getByTestId('list-composer-button');
        this.listNameInput = page.getByPlaceholder('Enter list name…');
        this.addListButton = page.getByTestId('list-composer-add-list-button');

        // Initialize Card Locators
        this.cardTitleInput = page.getByPlaceholder('Enter a title or paste a link');
        this.addCardButton = page.getByTestId('list-card-composer-add-card-button');
        this.cardDoneButton = page.getByTestId('card-done-state-completion-button');

        // Initialize Checklist Locators
        this.checklistButton = page.getByTestId('ChecklistIcon');
        this.checklistTitleInput = page.getByLabel('Title');
        this.addChecklistButton = page.getByTestId('checklist-add-button');
        this.checklistItemInput = page.getByTestId('check-item-name-input');
        this.addChecklistItemButton = page.getByTestId('check-item-add-button');
        this.cancelChecklistButton = page.getByRole('button', { name: 'Cancel' });
        this.checklistProgressPercentage = page.getByTestId('checklist-progress-percentage');

        // Initialize Card Details Locators
        this.descriptionButton = page.getByTestId('description-button');
        this.descriptionInput = page.locator('#ak-editor-textarea');
        this.descriptionSaveButton = page.getByTestId('description-save-button');
        this.addToCardButton = page.getByTestId('card-back-add-to-card-button');
        this.attachmentButton = page.getByTestId('card-back-attachment-button');
        this.chooseFileButton = page.getByRole('button', { name: 'Choose a file' });
        this.deleteAttachmentButton = page.getByTestId('delete-attachment');
        this.confirmDeleteButton = page.getByTestId('popover-confirm-button');
        this.moveCardButton = page.locator('button.WTF5k9ZC8MHUNi');
        this.moveCardBoardSelect = page.getByTestId('move-card-popover-select-board-destination-select--dropdown-indicator');
        this.moveCardListSelect = page.getByTestId('move-card-popover-select-list-destination-select--dropdown-indicator');
        this.moveCardSubmitButton = page.getByTestId('move-card-popover-move-button');

        // Initialize Board Close Locators
        this.closeBoardButton = page.locator("span[class='nch-icon A3PtEe1rGIm_yL J2CpPoHYfZ2U6i fAvkXZrzkeHLoc']");
        this.closeBoardMenuButton = page.locator("div.S1YMKJFPn9WNGk").getByText('Close board');
        this.confirmCloseBoardButton = page.getByTestId("popover-close-board-confirm");
        this.deleteBoardButton = page.getByTestId("close-board-delete-board-button");
        this.confirmDeleteBoardButton = page.getByTestId("close-board-delete-board-confirm-button");
        this.viewClosedBoardsBtn = page.getByRole('button', { name: 'View all closed boards' });
    }

    async createNewBoard(boardName: string) {
        await this.createBoardButton.click();
        await this.backgroundButton.click();
        await this.photosButton.click();
        await this.boardTitleInput.fill(boardName);
        await this.createBoardSubmitButton.click();
    }

    async switchToProjectWorkspace() {
        await this.page.getByRole('link', { name: 'P Playwright Practice' }).click();
        await this.page.getByTestId('home-team-boards-tab').click();
    }

    async createLists(listNames: string[]) {
        await this.listComposerButton.click();
        for (const listName of listNames) {
            await this.listNameInput.fill(listName);
            await this.page.waitForTimeout(500);
            await this.addListButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    async createCard(listName: string, cardTitle: string) {
        await this.page.locator('li').filter({ hasText: listName }).getByTestId('list-add-card-button').click();
        await this.cardTitleInput.fill(cardTitle);
        await this.addCardButton.click();
    }

    async toggleCardCompletion(cardName: string) {
        const card = this.page.locator('span').filter({ hasText: cardName });
        await card.hover();
        await this.cardDoneButton.click();
    }

    async dragAndDropCard(cardName: string, targetListName: string) {
        const dragSelector = `[data-testid="card-name"]:has-text("${cardName}")`;
        const dropSelector = `li:has-text("${targetListName}")`;
        await this.page.dragAndDrop(dragSelector, dropSelector);
    }

    async createChecklist(cardName: string, checklistTitle: string, items: string[]) {
        await this.page.getByTestId('card-name').filter({ hasText: cardName }).click();
        await this.descriptionButton.click();
        await this.descriptionInput.fill('Trello Task Description');
        await this.descriptionSaveButton.click();
        await this.checklistButton.click();
        await this.checklistTitleInput.fill(checklistTitle);
        await this.addChecklistButton.click();

        for (const item of items) {
            await this.checklistItemInput.fill(item);
            await this.addChecklistItemButton.click();
            await this.page.waitForTimeout(250);
        }
        await this.cancelChecklistButton.click();
    }

    async completeChecklistItems(cardName: string, items: string[]) {
        await this.page.getByTestId('card-name').filter({ hasText: cardName }).click();
        for (const item of items) {
            const checklistLocator = this.page.locator('li').filter({ hasText: item }).getByTestId('clickable-checkbox');
            if (checklistLocator) {
                await checklistLocator.click();
            }
        }
        const progress = await this.checklistProgressPercentage.innerText();
        if (progress !== '100%') {
            throw new Error(`Checklist progress is not 100%, it is ${progress}`);
        }
        //await this.cardDoneButton.click();
    }

    async uploadAttachment(cardName: string, filePath: string) {
        await this.page.getByRole('link', { name: cardName }).click();
        await this.page.getByRole('button', { name: 'Add to card' }).click();
        await this.attachmentButton.click();
        await this.page.locator('#card-attachment-file-picker').setInputFiles(filePath);
        await this.page.getByTestId('attachment-thumbnail').first().waitFor({ state: 'visible' });
    }

    async deleteAttachment(cardName: string) {
        await this.page.getByTestId('card-name').filter({ hasText: cardName }).click();
        await this.page.getByTestId('attachment-thumbnail').click();
        await this.deleteAttachmentButton.click();
        await this.confirmDeleteButton.click();
        await this.page.waitForTimeout(500);
    }

    async moveCardToList(cardName: string, targetBoardName: string, targetListName: string) {
        await this.page.getByTestId('card-name').filter({ hasText: cardName }).click();
        await this.moveCardButton.click();
        await this.moveCardBoardSelect.click();
        await this.page.getByText(targetBoardName).click();
        await this.moveCardListSelect.click();
        await this.page.getByText(targetListName).click();
        await this.moveCardSubmitButton.click();
    }

    async closeBoard(boardName: string): Promise<void> {
        await this.page.waitForTimeout(5000);
        await this.page.locator('div.LinesEllipsis').getByText(boardName).click();
        await this.closeBoardButton.click();
        await this.closeBoardMenuButton.click();
        await this.confirmCloseBoardButton.click();
        await this.deleteBoardButton.click();
        await this.confirmDeleteBoardButton.click();
        const boardElement = this.page.locator('div.LinesEllipsis').filter({ hasText: boardName });
        await expect(boardElement).toBeHidden();
    }

    async switchToBoard(boardName: string): Promise<void> {
        await this.page.getByRole('link', { name: boardName }).click();
    }

    async clearClosedBoards(): Promise<void> {
        await this.viewClosedBoardsBtn.click();
        await this.page.waitForTimeout(2000);
        for (const deleteElement of await this.deleteBoardButton.all()) {
            await deleteElement.click();
            await this.confirmDeleteBoardButton.click();
        }
    }
}