// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: hockey-puck;

/********************************************************
 * script     : NHL-MyTeam-Widget.js
 * version    : 5.4.1
 * description: Widget for Scriptable.app, which shows
 *              the next games for your NHL team
 * author     : @thisisevanfox
 * support    : https://git.io/JtkA1
 * date       : 2025-09-26
 *******************************************************/

/********************************************************
 ******************** USER SETTINGS *********************
 ************ PLEASE MODIFY BEFORE FIRST RUN ************
 *******************************************************/

// Type the abbreviation of your NHL team here.
// Atlantic Division: BOS, BUF, DET, FLA, MTL, OTT, TBL, TOR
// Metropolitan Division: CAR, CBJ, NJD, NYI, NYR, PHI, PIT, WSH
// Central Division: CHI, COL, DAL, MIN, NSH, STL, UTA, WPG
// Pacific Division: ANA, CGY, EDM, LAK, SJS, SEA, VAN, VGK
const MY_NHL_TEAM = "ENTER_TEAM_ABBREVIATION_HERE";

// Indicator if livescores should be shown.
// If you don't want to be spoilered set it to false.
// Default: true
const SHOW_LIVE_SCORES = true;

// Indicator if all scores and stats should be shown.
// If you don't want to be spoilered set it to false.
// Default: true
const SHOW_STATS_AND_STANDINGS = true;

// Indicator if the home team should show first (like it's common in Europe)
// Default: true (home team shows first, e.g. "home - away")
// false (away team shows first, e.g. "away @ home")
const SHOW_HOME_TEAM_FIRST = true;

// Indicator if the descriptions of the stats should be shown
// Default: true (W: x - L: x - OTL: x)
// false (x - x - x)
const SHOW_STATS_DESCRIPTION = true;

// URL to shares app
// Default: "nhl://" (Official NHL app)
// If you don't want anything to open, type:
// const WIDGET_URL = "";
const WIDGET_URL = "nhl://";

// Set appearance of the widget. Default apperance is set to the system color scheme.
// Device.isUsingDarkAppearance() = System color scheme (default)
// true = Widget will be in dark mode.
// false = Widget will be in light mode.
const DARK_MODE = Device.isUsingDarkAppearance();

// Indicator if caching of logos is actived (saves datavolume)
// Default: true
const CACHING_ACTIVE = true;

// Indicator if no-background.js is installed
// Default: false
// @see: https://github.com/supermamon/scriptable-no-background
const NO_BACKGROUND_INSTALLED = false;

// Indicator if no-background.js should be active
// Only matters if NO_BACKGROUND_INSTALLED is true.
const NO_BACKGROUND_ACTIVE = true;

// Indicator if no-background.js should be active for whole widget
// No background for widget and no background for stacks in the widget
// Only matters if NO_BACKGROUND_INSTALLED is true.
const NO_BACKGROUND_FULL_ACTIVE = false;

/********************************************************
 ********************************************************
 *********** DO NOT CHANGE ANYTHING FROM HERE ***********
 ********************************************************
 *******************************************************/
const { transparent } = NO_BACKGROUND_INSTALLED
  ? importModule("no-background")
  : emptyFunction();

const WIDGET_BACKGROUND = DARK_MODE ? new Color("gray") : new Color("#D6D6D6");
const STACK_BACKGROUND = DARK_MODE
  ? new Color("#1D1D1D")
  : new Color("#FFFFFF"); //Smaller Container Background

let oNhlWidget;
if (config.runsInWidget) {
  if (config.widgetFamily === "small") {
    oNhlWidget = await createSmallWidget();
  }
  if (config.widgetFamily === "medium") {
    oNhlWidget = await createMediumWidget();
  }
  if (config.widgetFamily === "large") {
    oNhlWidget = await createLargeWidget();
  }
  Script.setWidget(oNhlWidget);
} else {
  oNhlWidget = await createMediumWidget();
  oNhlWidget.presentMedium();
  // oNhlWidget = await createSmallWidget();
  // oNhlWidget.presentSmall();
  // oNhlWidget = await createLargeWidget();
  // oNhlWidget.presentLarge();
}

/**
 * Creates small sized widget.
 *
 * @return {ListWidget}
 */
async function createSmallWidget() {
  // Initialise widget
  const oWidget = new ListWidget();
  oWidget.backgroundColor = DARK_MODE
    ? new Color("1D1D1D")
    : new Color("#D6D6D6");
  oWidget.setPadding(10, 10, 10, 10);
  if (WIDGET_URL.length > 0) {
    oWidget.url = WIDGET_URL;
  }

  await addSmallWidgetData(oWidget);

  return oWidget;
}

/**
 * Creates medium sized widget.
 *
 * @return {ListWidget}
 */
async function createMediumWidget() {
  // Initialise widget
  const oWidget = new ListWidget();
  if (NO_BACKGROUND_INSTALLED && NO_BACKGROUND_ACTIVE) {
    oWidget.backgroundImage = await transparent(Script.name());
  } else {
    oWidget.backgroundColor = WIDGET_BACKGROUND;
  }
  oWidget.setPadding(10, 10, 10, 10);
  if (WIDGET_URL.length > 0) {
    oWidget.url = WIDGET_URL;
  }

  await addMediumWidgetData(oWidget);

  return oWidget;
}

/**
 * Add data to small sized widget.
 *
 * @param {ListWidget} oWidget
 */
async function addSmallWidgetData(oWidget) {
  const oGameData = await prepareData();

  if (oGameData != null) {
    let oMyTeam;
    let oOpponentTeam;
    if (oGameData.homeTeam.abbrev == MY_NHL_TEAM) {
      oMyTeam = oGameData.homeTeam;
      oOpponentTeam = oGameData.awayTeam;
    } else {
      oOpponentTeam = oGameData.homeTeam;
      oMyTeam = oGameData.awayTeam;
    }

    const oUpperStack = oWidget.addStack();
    oUpperStack.layoutHorizontally();

    const oUpperTextStack = oUpperStack.addStack();
    oUpperTextStack.layoutVertically();

    const dGameDate = new Date(oGameData.gameDate);
    const dLocalDate = dGameDate.toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const oGameDateText = oUpperTextStack.addText(
      `${dLocalDate.split(",")[0]}`
    );
    oGameDateText.font = Font.boldSystemFont(11);
    oGameDateText.textColor = getColorForCurrentAppearance();

    if (!!dLocalDate.split(",")[1]) {
      const oGameTimeText = oUpperTextStack.addText(
        `${dLocalDate.split(",")[1].trim()}`
      );
      oGameTimeText.font = Font.boldSystemFont(11);
      oGameTimeText.textColor = getColorForCurrentAppearance();
    }

    if (oGameData.venue != "") {
      const oVenueText = oUpperTextStack.addText(`@ ${oGameData.venue}`);
      oVenueText.font = Font.boldSystemFont(11);
      oVenueText.textColor = getColorForCurrentAppearance();
    }

    oUpperStack.addSpacer();

    const oOpponentLogoImage = await loadLogo(
      oOpponentTeam.logoLink,
      oOpponentTeam.abbrev
    );
    const oOpponentLogo = oUpperStack.addImage(oOpponentLogoImage);
    oOpponentLogo.imageSize = new Size(40, 40);

    if (SHOW_STATS_AND_STANDINGS) {
      oWidget.addSpacer(4);

      let sOpponentStatsText;
      if (SHOW_STATS_DESCRIPTION) {
        sOpponentStatsText =
          "W: " +
          oOpponentTeam.record.wins +
          " - L: " +
          oOpponentTeam.record.losses +
          " - OTL: " +
          oOpponentTeam.record.ot;
      } else {
        sOpponentStatsText =
          oOpponentTeam.record.wins +
          " - " +
          oOpponentTeam.record.losses +
          " - " +
          oOpponentTeam.record.ot;
      }

      const oOpponentTeamStatsText = oWidget.addText(sOpponentStatsText);
      oOpponentTeamStatsText.font = Font.systemFont(11);
      oOpponentTeamStatsText.textColor = getColorForCurrentAppearance();

      const oOpponentTeamStandingsText = oWidget.addText(
        "Div.: " +
        oOpponentTeam.record.divisionRank +
        "." +
        " | Lea.: " +
        oOpponentTeam.record.leagueRank +
        "."
      );
      oOpponentTeamStandingsText.font = Font.systemFont(11);
      oOpponentTeamStandingsText.textColor = getColorForCurrentAppearance();

      if (oOpponentTeam.topscorer.name != null) {
        const oOpponentTeamTopScorerText = oWidget.addText(
          `${oOpponentTeam.topscorer.name} (${oOpponentTeam.topscorer.points})`
        );
        oOpponentTeamTopScorerText.font = Font.systemFont(11);
        oOpponentTeamTopScorerText.textColor = getColorForCurrentAppearance();
      }
    }

    if (SHOW_STATS_AND_STANDINGS) {
      const oDivider = oWidget.addText(`___________________________`);
      oDivider.font = Font.boldSystemFont(6);
      oDivider.textColor = getColorForCurrentAppearance();

      oWidget.addSpacer(6);

      const oBottomStack = oWidget.addStack();
      oBottomStack.layoutHorizontally();

      const oBottomTextStack = oBottomStack.addStack();
      oBottomTextStack.layoutVertically();

      let sMyTeamStatsText;
      if (SHOW_STATS_DESCRIPTION) {
        sMyTeamStatsText =
          "W: " +
          oMyTeam.record.wins +
          " - L: " +
          oMyTeam.record.losses +
          " - OTL: " +
          oMyTeam.record.ot;
      } else {
        sMyTeamStatsText =
          oMyTeam.record.wins +
          " - " +
          oMyTeam.record.losses +
          " - " +
          oMyTeam.record.ot;
      }

      const oMyTeamStatsText = oBottomTextStack.addText(sMyTeamStatsText);
      oMyTeamStatsText.font = Font.systemFont(9);
      oMyTeamStatsText.textColor = getColorForCurrentAppearance();

      const oMyTeamStandingsText = oBottomTextStack.addText(
        "Div.: " +
        oMyTeam.record.divisionRank +
        "." +
        " | Lea.: " +
        oMyTeam.record.leagueRank +
        "."
      );
      oMyTeamStandingsText.font = Font.systemFont(9);
      oMyTeamStandingsText.textColor = getColorForCurrentAppearance();

      if (oMyTeam.topscorer.name != null) {
        const oMyTeamTopScorerText = oBottomTextStack.addText(
          `${oMyTeam.topscorer.name} (${oMyTeam.topscorer.points})`
        );
        oMyTeamTopScorerText.font = Font.systemFont(9);
        oMyTeamTopScorerText.textColor = getColorForCurrentAppearance();
      }

      oBottomStack.addSpacer();

      const oMyTeamLogoImage = await loadLogo(
        oMyTeam.logoLink,
        oMyTeam.abbrev
      );
      const oMyTeamLogo = oBottomStack.addImage(oMyTeamLogoImage);
      oMyTeamLogo.imageSize = new Size(25, 25);
    }
  } else {
    const oHeadingText = oWidget.addText(`No upcoming games. Season ended.`);
    oHeadingText.font = Font.boldSystemFont(11);
    oHeadingText.textColor = getColorForCurrentAppearance();

    oWidget.addSpacer();
  }
}

/**
 * Add data to medium sized widget.
 *
 * @param {ListWidget} oWidget
 */
async function addMediumWidgetData(oWidget) {
  const oGameData = await prepareData();

  const oTopRow = oWidget.addStack();
  await setStackBackground(oTopRow);
  oTopRow.cornerRadius = 12;
  oTopRow.size = new Size(308, 15);
  oTopRow.setPadding(7, 7, 7, 7);
  oTopRow.layoutVertically();

  const oSpacerStack1 = oTopRow.addStack();
  oSpacerStack1.layoutHorizontally();
  oSpacerStack1.addSpacer();

  if (oGameData != null) {
    const oHeadingStack = oTopRow.addStack();
    oHeadingStack.layoutHorizontally();
    oHeadingStack.addSpacer();
    oHeadingStack.setPadding(7, 7, 7, 7);

    let oHeadingText;
    if (
      oGameData.currentPeriod != undefined &&
      oGameData.currentPeriod != null &&
      oGameData.currentPeriod != "" &&
      SHOW_LIVE_SCORES
    ) {
      oHeadingText = oHeadingStack.addText(
        `Period: ${oGameData.currentPeriod} - ${oGameData.timeRemaining}`
      );
    } else {
      const dGameDate = new Date(oGameData.gameDate);
      const dNow = new Date();
      const bGameIsToday = dNow.toDateString() === dGameDate.toDateString();
      const sDatePart = bGameIsToday ? "Today" :
        dGameDate.toLocaleString([], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        });
      const sTimePart = dGameDate.toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const sGameDateText = `${sDatePart}, ${sTimePart}`;
      const sVenueText = oGameData.venue != "" ? ` @ ${oGameData.venue}` : ``;
      oHeadingText = oHeadingStack.addText(`${sGameDateText}${sVenueText}`);
    }
    oHeadingText.font = Font.boldSystemFont(11);
    oHeadingText.textColor = getColorForCurrentAppearance();

    oHeadingStack.addSpacer();

    const oSpacerStack2 = oTopRow.addStack();
    oSpacerStack2.layoutHorizontally();
    oSpacerStack2.addSpacer();

    oWidget.addSpacer();

    const oNextGameStack = oWidget.addStack();
    oNextGameStack.layoutHorizontally();
    oNextGameStack.cornerRadius = 12;

    if (SHOW_HOME_TEAM_FIRST) {
      await addHomeTeamStack(oNextGameStack, oGameData);
      oNextGameStack.addSpacer();
      await addAwayTeamStack(oNextGameStack, oGameData);
    } else {
      await addAwayTeamStack(oNextGameStack, oGameData);
      oNextGameStack.addSpacer();
      await addHomeTeamStack(oNextGameStack, oGameData);
    }
    oWidget.addSpacer();

    const oFutureGamesStack = oWidget.addStack();
    oFutureGamesStack.layoutHorizontally();
    oFutureGamesStack.centerAlignContent();
    await setStackBackground(oFutureGamesStack);
    oFutureGamesStack.cornerRadius = 12;
    oFutureGamesStack.setPadding(3, 7, 3, 7);
    oFutureGamesStack.addSpacer();
    oFutureGamesStack.size = new Size(308, 15);

    for (let i = 0; i < oGameData.nextGames.length; i++) {
      const oNextGame = oGameData.nextGames[i];

      const oFutureGame = oFutureGamesStack.addStack();
      oFutureGame.layoutHorizontally();
      oFutureGame.addSpacer();

      const oFutureGameLogoImage = await loadLogo(
        oNextGame.opponent.logoLink,
        oNextGame.opponent.abbrev
      );
      const oNextGameLogo = oFutureGame.addImage(oFutureGameLogoImage);
      oNextGameLogo.imageSize = new Size(15, 15);

      const dGameDate = new Date(oNextGame.gameDate);
      const dLocalDate = dGameDate.toLocaleString([], {
        month: "2-digit",
        day: "2-digit",
      });
      const oNextGameText = oFutureGame.addText(` ${dLocalDate}`);
      oNextGameText.font = Font.systemFont(11);
      oNextGameText.textColor = getColorForCurrentAppearance();

      oFutureGame.addSpacer();
    }

    oFutureGamesStack.addSpacer();
  } else {
    const oHeadingStack = oTopRow.addStack();
    oHeadingStack.layoutHorizontally();
    oHeadingStack.addSpacer();
    oHeadingStack.setPadding(7, 7, 7, 7);

    const oHeadingText = oHeadingStack.addText(
      `No upcoming games. Season ended.`
    );
    oHeadingText.font = Font.boldSystemFont(11);
    oHeadingText.textColor = getColorForCurrentAppearance();

    oHeadingStack.addSpacer();

    const oSpacerStack2 = oTopRow.addStack();
    oSpacerStack2.layoutHorizontally();
    oSpacerStack2.addSpacer();

    oWidget.addSpacer();
  }
}

/**
 * Adds stack for home team to the medium sized widget.
 *
 * @param {Object} oNextGameStack
 * @param {Object} oGameData
 */
async function addHomeTeamStack(oNextGameStack, oGameData) {
  const oHomeTeamStack = oNextGameStack.addStack();
  oHomeTeamStack.layoutVertically();
  oHomeTeamStack.centerAlignContent();
  oHomeTeamStack.setPadding(7, 7, 7, 7);
  await setStackBackground(oHomeTeamStack);
  oHomeTeamStack.cornerRadius = 12;
  oHomeTeamStack.size = new Size(150, 0);

  const oHomeTeamLogoStack = oHomeTeamStack.addStack();
  oHomeTeamLogoStack.layoutHorizontally();

  const oHomeLogoImage = await loadLogo(
    oGameData.homeTeam.logoLink,
    oGameData.homeTeam.abbrev
  );
  const oHomeLogo = oHomeTeamLogoStack.addImage(oHomeLogoImage);
  oHomeLogo.imageSize = new Size(40, 40);

  if (SHOW_LIVE_SCORES) {
    oHomeTeamLogoStack.addSpacer(45);
    const oHomeTeamGoalsText = oHomeTeamLogoStack.addText(
      !oGameData.currentPeriod ? `-` : `${oGameData.homeTeam.goals}`
    );
    oHomeTeamGoalsText.font = Font.boldSystemFont(35);
    oHomeTeamGoalsText.textColor = getColorForCurrentAppearance();
  }

  if (SHOW_STATS_AND_STANDINGS) {
    let sHomeTeamStatsText;
    if (SHOW_STATS_DESCRIPTION) {
      sHomeTeamStatsText =
        "W: " +
        oGameData.homeTeam.record.wins +
        " - L: " +
        oGameData.homeTeam.record.losses +
        " - OTL: " +
        oGameData.homeTeam.record.ot;
    } else {
      sHomeTeamStatsText =
        oGameData.homeTeam.record.wins +
        " - " +
        oGameData.homeTeam.record.losses +
        " - " +
        oGameData.homeTeam.record.ot;
    }

    const oHomeTeamStatsText = oHomeTeamStack.addText(sHomeTeamStatsText);
    oHomeTeamStatsText.font = Font.systemFont(11);
    oHomeTeamStatsText.textColor = getColorForCurrentAppearance();

    const oHomeTeamStandingsText = oHomeTeamStack.addText(
      "Division: " +
      oGameData.homeTeam.record.divisionRank +
      "." +
      " | League: " +
      oGameData.homeTeam.record.leagueRank +
      "."
    );
    oHomeTeamStandingsText.font = Font.systemFont(9);
    oHomeTeamStandingsText.textColor = getColorForCurrentAppearance();

    if (oGameData.homeTeam.topscorer.name != null) {
      const oHomeTeamTopScorerText = oHomeTeamStack.addText(
        `${oGameData.homeTeam.topscorer.name} (${oGameData.homeTeam.topscorer.points})`
      );
      oHomeTeamTopScorerText.centerAlignText();
      oHomeTeamTopScorerText.font = Font.systemFont(9);
      oHomeTeamTopScorerText.textColor = getColorForCurrentAppearance();
    }
  }
}

/**
 * Adds stack for away team to the medium sized widget.
 *
 * @param {Object} oNextGameStack
 * @param {Object} oGameData
 */
async function addAwayTeamStack(oNextGameStack, oGameData) {
  const oAwayTeamStack = oNextGameStack.addStack();
  oAwayTeamStack.layoutVertically();
  oAwayTeamStack.centerAlignContent();
  oAwayTeamStack.setPadding(7, 7, 7, 7);
  await setStackBackground(oAwayTeamStack);
  oAwayTeamStack.cornerRadius = 12;
  oAwayTeamStack.size = new Size(150, 0);

  const oAwayTeamLogoStack = oAwayTeamStack.addStack();
  oAwayTeamLogoStack.layoutHorizontally();

  const oAwayLogoImage = await loadLogo(
    oGameData.awayTeam.logoLink,
    oGameData.awayTeam.abbrev
  );
  const oAwayLogo = oAwayTeamLogoStack.addImage(oAwayLogoImage);
  oAwayLogo.imageSize = new Size(40, 40);

  if (SHOW_LIVE_SCORES) {
    oAwayTeamLogoStack.addSpacer(45);

    const oAwayTeamGoalsText = oAwayTeamLogoStack.addText(
      !oGameData.currentPeriod ? `-` : `${oGameData.awayTeam.goals}`
    );
    oAwayTeamGoalsText.font = Font.boldSystemFont(35);
    oAwayTeamGoalsText.textColor = getColorForCurrentAppearance();
  }

  if (SHOW_STATS_AND_STANDINGS) {
    let sAwayTeamStatsText;
    if (SHOW_STATS_DESCRIPTION) {
      sAwayTeamStatsText =
        "W: " +
        oGameData.awayTeam.record.wins +
        " - L: " +
        oGameData.awayTeam.record.losses +
        " - OTL: " +
        oGameData.awayTeam.record.ot;
    } else {
      sAwayTeamStatsText =
        oGameData.awayTeam.record.wins +
        " - " +
        oGameData.awayTeam.record.losses +
        " - " +
        oGameData.awayTeam.record.ot;
    }

    const oAwayTeamStatsText = oAwayTeamStack.addText(sAwayTeamStatsText);
    oAwayTeamStatsText.font = Font.systemFont(11);
    oAwayTeamStatsText.textColor = getColorForCurrentAppearance();

    const oAwayTeamStandingsText = oAwayTeamStack.addText(
      "Division: " +
      oGameData.awayTeam.record.divisionRank +
      "." +
      " | League: " +
      oGameData.awayTeam.record.leagueRank +
      "."
    );
    oAwayTeamStandingsText.font = Font.systemFont(9);
    oAwayTeamStandingsText.textColor = getColorForCurrentAppearance();

    if (oGameData.awayTeam.topscorer.name != null) {
      const oAwayTeamTopScorerText = oAwayTeamStack.addText(
        `${oGameData.awayTeam.topscorer.name} (${oGameData.awayTeam.topscorer.points})`
      );
      oAwayTeamTopScorerText.font = Font.systemFont(9);
      oAwayTeamTopScorerText.textColor = getColorForCurrentAppearance();
    }
  }
}

/**
 * Prepares data.
 *
 * @return {Object[]}
 */
async function prepareData() {
  const oData = {
    gameDate: "",
    venue: "",
    currentPeriod: 0,
    timeRemaining: "",
    nextGames: [],
    homeTeam: {
      abbrev: "",
      logoLink: "",
      record: {},
      goals: "",
      topscorer: {
        name: null,
        points: "",
      },
    },
    awayTeam: {
      abbrev: "",
      logoLink: "",
      record: {},
      goals: "",
      topscorer: {
        name: null,
        points: "",
      },
    },
  };
  try {
    const oTeamData = getTeamData();
    const aScheduleData = await fetchScheduleData();
    const oStandings = await fetchCurrentStandings();

    if (
      aScheduleData &&
      aScheduleData.length > 0
    ) {
      const oNextGame = aScheduleData[0];

      if (oNextGame != undefined) {
        const oHomeTeam = oNextGame.homeTeam;
        const oAwayTeam = oNextGame.awayTeam;

        const oHomeTeamTopScorer = await fetchTopScorerByAbbreviation(oHomeTeam.abbrev);
        const oAwayTeamTopScorer = await fetchTopScorerByAbbreviation(oAwayTeam.abbrev);

        const oHomeTeamStandings = filterStandingsByAbbreviation(
          oHomeTeam.abbrev,
          oStandings
        );
        const oAwayTeamStandings = filterStandingsByAbbreviation(
          oAwayTeam.abbrev,
          oStandings
        );

        oData.gameDate = oNextGame.startTimeUTC;
        oData.venue = oNextGame.venue.default;
        oData.nextGames = getNextGames(aScheduleData.splice(0, aScheduleData.length), oTeamData);
        oData.homeTeam.abbrev = oHomeTeam.abbrev;
        oData.homeTeam.logoLink = oTeamData[oHomeTeam.abbrev].logo;
        oData.homeTeam.record = oHomeTeamStandings;
        oData.awayTeam.abbrev = oAwayTeam.abbrev;
        oData.awayTeam.logoLink = oTeamData[oAwayTeam.abbrev].logo;
        oData.awayTeam.record = oAwayTeamStandings;

        if (oHomeTeamTopScorer != null) {
          oData.homeTeam.topscorer.name = `${oHomeTeamTopScorer.firstName.default} ${oHomeTeamTopScorer.lastName.default}`;
          oData.homeTeam.topscorer.points = oHomeTeamTopScorer.points;
        }
        if (oAwayTeamTopScorer != null) {
          oData.awayTeam.topscorer.name = `${oAwayTeamTopScorer.firstName.default} ${oAwayTeamTopScorer.lastName.default}`;
          oData.awayTeam.topscorer.points = oAwayTeamTopScorer.points;
        }

        if (SHOW_LIVE_SCORES) {
          const oLiveData = await fetchLiveData(oNextGame.id);
          if (oLiveData) {
            oData.currentPeriod = oLiveData.period;
            oData.timeRemaining = oLiveData.clock?.timeRemaining;
            oData.homeTeam.goals = oLiveData.homeTeam?.score;
            oData.awayTeam.goals = oLiveData.awayTeam?.score;
          }
        }
      }
    } else {
      return null;
    }
    // Set up the file manager.
    const oFiles = FileManager.local();

    // Set up cache
    const sCachePath = oFiles.joinPath(oFiles.cacheDirectory(), 'nhl_data.json');

    // Save data for later use.
    oFiles.writeString(sCachePath, JSON.stringify(oData))

    return oData;
  } catch (e) {
    // Set up the file manager.
    const oFiles = FileManager.local();

    // Set up cache
    const sCachePath = oFiles.joinPath(oFiles.cacheDirectory(), 'nhl_data.json');

    // Read previously stored data.
    const oStoredData = oFiles.readString(sCachePath);
    return JSON.parse(oStoredData);
  }
}

/**
 * Returns next games.
 *
 * @param {Object[]} aGames
 * @param {Object} oTeamData
 * @return {Object[]}
 */
function getNextGames(aGames, oTeamData) {
  const aNextGames = [];
  const iLength = aGames.length < 5 ? aGames.length : 5;

  for (let i = 1; i < iLength; i++) {
    let oData = {
      gameDate: "",
      opponent: {
        abbrev: "",
        logoLink: "",
      },
    };

    const oGame = aGames[i];
    oData.gameDate = new Date(oGame.startTimeUTC);
    if (oGame.awayTeam.abbrev == MY_NHL_TEAM) {
      oData.opponent.abbrev = oGame.homeTeam.abbrev;
    } else {
      // Yeey, it's a homegame for my team :-)
      oData.opponent.abbrev = oGame.awayTeam.abbrev;
    }
    oData.opponent.logoLink = oTeamData[oData.opponent.abbrev]?.logo;

    aNextGames.push(oData);
  }

  return aNextGames;
}

/**
 * Filters standings by team id.
 *
 * @param {String} sTeamId
 * @param {Object} oStandings
 * @return {Object}
 */
function filterStandingsByAbbreviation(sAbbreviation, oStandings) {
  let oResult = null;
  if (oStandings && oStandings?.standings) {
    const oTeamStanding = oStandings.standings.find(standing => standing.teamAbbrev.default === sAbbreviation);
    if (!!oTeamStanding) {
      oResult = {
        wins: oTeamStanding.wins,
        losses: oTeamStanding.losses,
        ot: oTeamStanding.otLosses,
        divisionRank: oTeamStanding.divisionSequence,
        leagueRank: oTeamStanding.leagueSequence,
      };
    }
  }
  if (oResult === null) {
    oResult = {
      wins: 0,
      losses: 0,
      ot: 0,
      divisionRank: 0,
      leagueRank: 0,
    };
  }

  return oResult;
}

/**
 * Fetches schedule data from NHL api.
 *
 * @return {Object}
 */
async function fetchScheduleData() {
  const sUrl = `https://api-web.nhle.com/v1/club-schedule-season/${MY_NHL_TEAM}/now`;
  const oRequest = new Request(sUrl);
  const oData = await oRequest.loadJSON();

  const todayDate = new Date();
  todayDate.setUTCHours(0, 0, 0, 0);

  const aGames = oData.games?.filter(game => {
    const gameDate = new Date(game.gameDate + 'T00:00:00Z');
    return (
      gameDate.getUTCFullYear() > todayDate.getUTCFullYear() ||
      (gameDate.getUTCFullYear() === todayDate.getUTCFullYear() &&
        gameDate.getUTCMonth() > todayDate.getUTCMonth()) ||
      (gameDate.getUTCFullYear() === todayDate.getUTCFullYear() &&
        gameDate.getUTCMonth() === todayDate.getUTCMonth() &&
        gameDate.getUTCDate() >= todayDate.getUTCDate())
    );
  });

  return aGames;
}

/**
 * Fetches top scorer data from NHL api.
 *
 * @param {string} sAbbreviation
 * @return {Object}
 */
async function fetchTopScorerByAbbreviation(sAbbreviation) {
  const sUrl = `https://api-web.nhle.com/v1/club-stats/${sAbbreviation}/now`;
  const oRequest = new Request(sUrl);
  const oData = await oRequest.loadJSON();

  let oResult = null;
  if (!!oData) {
    oResult = oData.skaters.sort((a, b) => a.points - b.points).reverse()[0];
  }

  return oResult;
}

/**
 * Fetches live standings data from NHL api.
 *
 * @param {string} sGameId
 * @return {Object}
 */
async function fetchLiveData(sGameId) {
  const sUrl = `https://api-web.nhle.com/v1/gamecenter/${sGameId}/boxscore`;
  const oRequest = new Request(sUrl);
  const oLiveData = await oRequest.loadJSON();

  return !oLiveData ? null : oLiveData;
}

/**
 * Fetches conference and league standings data from NHL api.
 *
 * @return {Object}
 */
async function fetchCurrentStandings() {
  const sUrl = `https://api-web.nhle.com/v1/standings/now`;
  const oRequest = new Request(sUrl);
  return await oRequest.loadJSON();
}

/**
 * Loads image from thesportsdb.com or from local cache.
 *
 * @param {String} sImageUrl
 * @param {String} sTeamAbbreviation
 * @return {Object}
 */
async function loadLogo(sImageUrl, sTeamAbbreviation) {
  let oResult;
  if (CACHING_ACTIVE) {
    // Set up the file manager.
    const oFiles = FileManager.local();

    // Set up cache
    const sCachePath = oFiles.joinPath(
      oFiles.cacheDirectory(),
      sTeamAbbreviation + "_NHL"
    );
    const bCacheExists = oFiles.fileExists(sCachePath);

    try {
      if (bCacheExists) {
        oResult = oFiles.readImage(sCachePath);
      } else {
        const oRequest = new Request(sImageUrl);
        oResult = await oRequest.loadImage();
        try {
          oFiles.writeImage(sCachePath, oResult);
          console.log("Created cache entry for logo of " + sTeamAbbreviation);
        } catch (e) {
          console.log(e);
        }
      }
    } catch (oError) {
      console.error(oError);
      if (bCacheExists) {
        oResult = oFiles.readImage(sCachePath);
      } else {
        console.log("Fetching logo for " + sTeamAbbreviation + " failed.");
      }
    }
  } else {
    const oRequest = new Request(sImageUrl);
    oResult = await oRequest.loadImage();
  }

  return oResult;
}

/**
 * Sets background for stack.
 *
 * @param {String} oStack
 */
async function setStackBackground(oStack) {
  if (
    NO_BACKGROUND_INSTALLED &&
    NO_BACKGROUND_ACTIVE &&
    NO_BACKGROUND_FULL_ACTIVE
  ) {
    oStack.backgroundImage = await transparent(Script.name());
  } else {
    oStack.backgroundColor = STACK_BACKGROUND;
  }
}

/**
 * Returns color object depending if dark mode is active or not.
 *
 * @return {Object}
 */
function getColorForCurrentAppearance() {
  return DARK_MODE ? Color.white() : Color.black();
}

/**
 * Placeholder function when no-background.js isn't installed.
 *
 * @return {Object}
 */
function emptyFunction() {
  // Silence
  return {};
}

/**
 * Returns static team data.
 *
 * @return {Object}
 */
function getTeamData() {
  return {
    // New Jersey Devils
    NJD: {
      id: "1",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/z4rsvp1619536740.png/preview",
    },
    // New York Islanders
    NYI: {
      id: "2",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/hqn8511619536714.png/preview",
    },
    // New York Rangers
    NYR: {
      id: "3",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/bez4251546192693.png/preview",
    },
    // Philadelphia Flyers
    PHI: {
      id: "4",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/qxxppp1421794965.png/preview",
    },
    // Pittsburgh Penguins
    PIT: {
      id: "5",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/dsj3on1546192477.png/preview",
    },
    // Boston Bruins
    BOS: {
      id: "6",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/b1r86e1720023232.png/preview",
    },
    // Buffalo Sabres
    BUF: {
      id: "7",
      logo: "https://r2.thesportsdb.com/images/media/team/badge/3m3jhp1619536655.png/preview",
    },
    // Montreal Canadiens
    MTL: {
      id: "8",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/stpryx1421791753.png/preview",
    },
    // Ottawa Senators
    OTT: {
      id: "9",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/2tc1qy1619536592.png/preview",
    },
    // Toronto Maple Leafs
    TOR: {
      id: "10",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/mxig4p1570129307.png/preview",
    },
    // Carolina Hurricanes
    CAR: {
      id: "12",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/v07m3x1547232585.png/preview",
    },
    // Florida Panthers
    FLA: {
      id: "13",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/8qtaz11547158220.png/preview",
    },
    // Tampa Bay Lightning
    TBL: {
      id: "14",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/swysut1421791822.png/preview",
    },
    // Washington Capitals
    WSH: {
      id: "15",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/99ca9a1638974052.png/preview",
    },
    // Chicago Blackhawks
    CHI: {
      id: "16",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/tuwyvr1422041801.png/preview",
    },
    // Detroit Red Wings
    DET: {
      id: "17",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/1c24ow1546544080.png/preview",
    },
    // Nashville Predators
    NSH: {
      id: "18",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/twqyvy1422052908.png/preview",
    },
    // St. Louis Blues
    STL: {
      id: "19",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/rsqtwx1422053715.png/preview",
    },
    // Calgary Flames
    CGY: {
      id: "20",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/v8vkk11619536610.png/preview",
    },
    // Colorado Avalanche
    COL: {
      id: "21",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/wqutut1421173572.png/preview",
    },
    // Edmonton Oilers
    EDM: {
      id: "22",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/uxxsyw1421618428.png/preview",
    },
    // Vancouver Canucks
    VAN: {
      id: "23",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/xqxxpw1421875519.png/preview",
    },
    // Anaheim Ducks
    ANA: {
      id: "24",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/1d465t1719573796.png/preview",
    },
    // Dallas Stars
    DAL: {
      id: "25",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/qrvywq1422042125.png/preview",
    },
    // Los Angeles Kings
    LAK: {
      id: "26",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/w408rg1719220748.png/preview",
    },
    // San Jose Sharks
    SJS: {
      id: "28",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/yui7871546193006.png/preview",
    },
    // Columbus Blue Jackets
    CBJ: {
      id: "29",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/ssytwt1421792535.png/preview",
    },
    // Minnesota Wild
    MIN: {
      id: "30",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/swtsxs1422042685.png/preview",
    },
    // Winnipeg Jets
    WPG: {
      id: "52",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/bwn9hr1547233611.png/preview",
    },
    // Vegas Golden Knights
    VGK: {
      id: "54",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/7fd4521619536689.png/preview",
    },
    // Seattle Kraken
    SEA: {
      id: "55",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/zsx49m1595775836.png/preview",
    },
    // Utah Mammoth
    UTA: {
      id: "68",
      logo:
        "https://r2.thesportsdb.com/images/media/team/badge/w5m2ab1746690303.png/preview",
    },
  };
}

/**
 * Creates large sized widget.
 *
 * @return {ListWidget}
 */
async function createLargeWidget() {
  // Initialise widget
  const oWidget = new ListWidget();
  oWidget.setPadding(10, 10, 10, 10);
  oWidget.url =
    "https://github.com/thisisevanfox/nhl-my-team-ios-widget/blob/main/Installation%20guide.md";

  const oHeadingStack = oWidget.addStack();
  oHeadingStack.layoutVertically();
  oHeadingStack.setPadding(7, 7, 7, 7);

  const oHeadingText = oHeadingStack.addText(
    `Currently a large widget is not supported. Only small and medium size widgets are possible. Don't know how to get it? Click the widget to read to the installation instructions.`
  );
  oHeadingText.font = Font.systemFont(16);
  oHeadingText.textColor = Color.red();

  return oWidget;
}

/********************************************************
 ************* MAKE SURE TO COPY EVERYTHING *************
 *******************************************************/
