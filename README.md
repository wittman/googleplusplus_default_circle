# GooglePlusPlus Default Circle

## General Information
The `googleplusplus_default_circle` userscript / extension for Google Plus (aka Google+ aka G+) adds a star next to each circle stream name. The star can be clicked to set or unset one circle stream as your default. When a default is set, going to the Stream view (which is an aggregate of all your circles) you automatically get redirected to your default stream.

Effectively, you can make one of your circles as the new everything you want to see by default based on one circle not all circles.

>**Install**: <http://go.wittman.org/ays9>

>_Discussion_: <https://plus.google.com/111309687695898923996/posts/15i6M5X7zrs>

So far, this userscript / extension was tested on Google Chrome 12 and Firefox 5 with [Greasemonkey](http://www.greasespot.net/) ([download](https://addons.mozilla.org/firefox/748/)) and should also work in Safari with the plugin [NinjaKit](http://d.hatena.ne.jp/os0x/20100612/1276330696) ([download](http://ss-o.net/safari/extension/NinjaKit.safariextz)).

Feedback is welcome.

## Change Log

### Version 0.2.6

- Critical update needed to work with current state of Google+. Auto-healing (updating for CSS map) implemented. FIX

### Version 0.2.2

- Changes made by Google recently introduced breaking DOM tree changes. Critical update needed. FIX

### Version 0.2.1

- Changes made today by Google introduced breaking DOM tree changes. All modules needed updating and are now fixed. FIX

### Version 0.1.9

- Star images replaced with transparency versions for better meshing with background. Thanks goes to extension user John (theiconmaster.com) for fixing the images. FIX

### Version 0.1.8

- Improved compatibility by converting unicode star characters to images. UPDATE
- Added small amount of left padding to stars for small browser window width cases. UPDATE
- Removed underline style seen while a star was hovered. UPDATE
- Now allows navigation to The Stream by clicking Stream without setting it as default. NEW

### Version 0.1.5

- User-requested feature Set Stream as starred-default implemented. NEW
- Changed button hover wording: from SET AS DEFAULT to simply SET to save space (all REMOVE DEFAULT is now UN-SET). UPDATE

### Version 0.1.4

- This fixes today's version 0.1.3 release which was broken. FIX

### Version 0.1.3

- Extension is functionally, language independent (not dependant on English present in the page). NEW

### Version 0.1.2

- Changed UI so empty stars always appear and can be clicked to set a new default without the extra step of unsetting the current (solid star) default. UPDATE

### Version 0.1.1

- Initial Release