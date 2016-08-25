# time-display

A set of elements for dealing with time in Polymer

`<time-display>` is an element to display time in human readable format using [fecha](https://github.com/taylorhakes/fecha)

`<time-diff>` is an element to display relative time in human readable format (i.e. "timeago")

For both elements, the datetime should be provided as an ISO 8601 formatted string (UTC) or
'now' to use the current system datetime. Each user will see the time difference and display
based on their own local time.

Examples:

```
<time-display datetime="2016-08-23T12:00:00.00" format="dddd, MMMM Do, YYYY"></time-display>
```
Displays: 'Tuesday, August 23rd, 2016' (in Mountain-Time timezone)

```
<time-diff></time-diff>
```

Displays: '5 minutes ago' (after 5 minutes) and updates as time goes on

```
<time-diff datetime="2016-08-23T12:00:00.00"></time-diff>
```

Displays: '2 days ago' (when this was authored)
