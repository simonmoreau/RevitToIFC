import {RevitToIFCAppHome} from './app.po';

fdescribe('RevitToIFC app', function () {

  let expectedMsg: string = 'This is the RevitToIFC application. This is the default page that loads for the application.';

  let page: RevitToIFCAppHome;

  beforeEach(() => {
    page = new RevitToIFCAppHome();
  });

  it('should display: ' + expectedMsg, () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual(expectedMsg)
  });
});
