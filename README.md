### **Daytripper**
##### Be less bored.
---
##### UMN group homework #1
---

Kevin Liao, Conor O’Neil, Gordon Frederickson

**Trello:** https://trello.com/b/UcjfumUz/umn
<br>**GitHub:** https://github.com/taigadigital/daytripper

### What does it do?
Give it an amount of time (4-12 hours) and and zip code. Based on that it will suggest things to do in that timeframe.

### How is it helpful?
Bored? Find something to do close to you (within reasonable travel distance).

### Describe a use case.
1. You have a few spare hours in a town you do not know well.
2. You are bored in your own locale and want to know what’s happening.
3. You want a variety of suggestions and not just searching for “coffee” or “movies.”

#### Example user story:
Input time to waste and a budget. Geolocate the location if need be. The application then returns a list of entertainment or scenic venues.

If we have time we also want to scrape the Popular Times data from Google Maps since it would be invaluable and this project is only a demonstration. This would allow the automatic injection of timing data for a trip.

Otherwise, the user will have to input custom time-to-spend data for a venue.

### What APIs does it use?
* Google Maps
* Ticketmaster

### What frameworks does it use?
Materialize (frontend CSS), Firebase (backend storage, no login).

### Rough breakdown of tasks
* Gordon - UX, frontend JS
* Kevin - Map backend
* Conor - APIs