export declare type KeyVal<T> = {
    [key: string]: T;
};
export declare type getPromise<T> = (callback: () => Promise<T>) => any;
/**
* The Blue Alliance V3 API
*
* Version 3.03.0
*/
export declare class API {
    private __key;
    private cache;
    constructor(key: string);
    private TBAGet<T>(path, onOutdated?);
    /**
    * Returns API status, and TBA status information.
    *
    * @param onCashExpire Get new promise once the cash expires
    */
    Status(onCashExpire?: getPromise<API_Status>): Promise<API_Status>;
    /**
    * Gets a list of `Team` objects, paginated in groups of 500.
    *
    * @param page_num Page number of results to return, zero-indexed
    * @param onCashExpire Get new promise once the cash expires
    */
    Teams(page_num: number, onCashExpire?: getPromise<Team[]>): Promise<Team[]>;
    /**
    * Gets a list of `Team` objects that competed in the given year, paginated in groups of 500.
    *
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param page_num Page number of results to return, zero-indexed
    * @param onCashExpire Get new promise once the cash expires
    */
    Teams(year: number, page_num: number, onCashExpire?: getPromise<Team[]>): Promise<Team[]>;
    /**
    * Gets a list of short form `Team_Simple` objects, paginated in groups of 500.
    *
    * @param page_num Page number of results to return, zero-indexed
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamsSimple(page_num: number, onCashExpire?: getPromise<Team_Simple[]>): Promise<Team_Simple[]>;
    /**
    * Gets a list of short form `Team_Simple` objects that competed in the given year, paginated in groups of 500.
    *
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param page_num Page number of results to return, zero-indexed
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamsSimple(year: number, page_num: number, onCashExpire?: getPromise<Team_Simple[]>): Promise<Team_Simple[]>;
    /**
    * Gets a list of Team keys, paginated in groups of 500. (Note, each page will not have 500 teams, but will include the teams within that range of 500.)
    *
    * @param page_num Page number of results to return, zero-indexed
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamsKeys(page_num: number, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets a list Team Keys that competed in the given year, paginated in groups of 500.
    *
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param page_num Page number of results to return, zero-indexed
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamsKeys(year: number, page_num: number, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets a `Team` object for the team referenced by the given key.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param onCashExpire Get new promise once the cash expires
    */
    Team(team_key: string, onCashExpire?: getPromise<Team>): Promise<Team>;
    /**
    * Gets a `Team_Simple` object for the team referenced by the given key.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamSimple(team_key: string, onCashExpire?: getPromise<Team_Simple>): Promise<Team_Simple>;
    /**
    * Gets a list of years in which the team participated in at least one competition.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamYears_participated(team_key: string, onCashExpire?: getPromise<number[]>): Promise<number[]>;
    /**
    * Gets an array of districts representing each year the team was in a district. Will return an empty array if the team was never in a district.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamDistricts(team_key: string, onCashExpire?: getPromise<District_List[]>): Promise<District_List[]>;
    /**
    * Gets a list of year and robot name pairs for each year that a robot name was provided. Will return an empty array if the team has never named a robot.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamRobots(team_key: string, onCashExpire?: getPromise<{
        [key: string]: Team_Robot;
    }>): Promise<{
        [key: string]: Team_Robot;
    }>;
    /**
    * Gets a list of all events this team has competed at.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEvents(team_key: string, onCashExpire?: getPromise<Event[]>): Promise<Event[]>;
    /**
    * Gets a list of events this team has competed at in the given year.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEvents(team_key: string, year: number, onCashExpire?: getPromise<Event[]>): Promise<Event[]>;
    /**
    * Gets a short-form list of all events this team has competed at.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEventsSimple(team_key: string, onCashExpire?: getPromise<Event_Simple[]>): Promise<Event_Simple[]>;
    /**
    * Gets a short-form list of events this team has competed at in the given year.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEventsSimple(team_key: string, year: number, onCashExpire?: getPromise<Event_Simple[]>): Promise<Event_Simple[]>;
    /**
    * Gets a list of the event keys for all events this team has competed at.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEventsKeys(team_key: string, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets a list of the event keys for events this team has competed at in the given year.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEventsKeys(team_key: string, year: number, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets a key-value list of the event statuses for events this team has competed at in the given year.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEventsStatuses(team_key: string, year: number, onCashExpire?: getPromise<{
        [event_key: string]: Team_Event_Status;
    }>): Promise<{
        [event_key: string]: Team_Event_Status;
    }>;
    /**
    * Gets a list of matches for the given team and event.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEventMatches(team_key: string, event_key: string, onCashExpire?: getPromise<Match[]>): Promise<Match[]>;
    /**
    * Gets a short-form list of matches for the given team and event.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEventMatchesSimple(team_key: string, event_key: string, onCashExpire?: getPromise<Match[]>): Promise<Match[]>;
    /**
    * Gets a list of match keys for matches for the given team and event.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEventMatchesKeys(team_key: string, event_key: string, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets a list of awards the given team won at the given event.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEventAwards(team_key: string, event_key: string, onCashExpire?: getPromise<Award[]>): Promise<Award[]>;
    /**
    * Gets the competition rank and status of the team at the given event.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamEventStatus(team_key: string, event_key: string, onCashExpire?: getPromise<Team_Event_Status>): Promise<Team_Event_Status>;
    /**
    * Gets a list of awards the given team has won.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamAwards(team_key: string, onCashExpire?: getPromise<Award[]>): Promise<Award[]>;
    /**
    * Gets a list of awards the given team has won in a given year.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamAwards(team_key: string, year: number, onCashExpire?: getPromise<Award[]>): Promise<Award[]>;
    /**
    * Gets a list of matches for the given team and year.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamMatches(team_key: string, year: number, onCashExpire?: getPromise<Match[]>): Promise<Match[]>;
    /**
    * Gets a short-form list of matches for the given team and year.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamMatchesSimple(team_key: string, year: number, onCashExpire?: getPromise<Match_Simple[]>): Promise<Match_Simple[]>;
    /**
    * Gets a list of match keys for matches for the given team and year.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamMatchesKeys(team_key: string, year: number, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets a list of Media (videos / pictures) for the given team and year.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamMedia(team_key: string, year: number, onCashExpire?: getPromise<Media[]>): Promise<Media[]>;
    /**
    * Gets a list of Media (videos / pictures) for the given team and tag.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param media_tag Media Tag which describes the Media.
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamMedia(team_key: string, media_tag: string, onCashExpire?: getPromise<Media[]>): Promise<Media[]>;
    /**
    * Gets a list of Media (videos / pictures) for the given team, tag and year.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param media_tag Media Tag which describes the Media.
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamMedia(team_key: string, media_tag: string, year: number, onCashExpire?: getPromise<Media[]>): Promise<Media[]>;
    /**
    * Gets a list of Media (social media) for the given team.
    *
    * @param team_key TBA Team Key, eg `frc254`
    * @param onCashExpire Get new promise once the cash expires
    */
    TeamSocial_media(team_key: string, onCashExpire?: getPromise<Media[]>): Promise<Media[]>;
    /**
    * Gets a list of events in the given year.
    *
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    Events(year: number, onCashExpire?: getPromise<Event[]>): Promise<Event[]>;
    /**
    * Gets a short-form list of events in the given year.
    *
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    EventsSimple(year: number, onCashExpire?: getPromise<Event_Simple[]>): Promise<Event_Simple[]>;
    /**
    * Gets a list of event keys in the given year.
    *
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    EventsKeys(year: number, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets an Event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    Event(event_key: string, onCashExpire?: getPromise<Event>): Promise<Event>;
    /**
    * Gets a short-form Event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventSimple(event_key: string, onCashExpire?: getPromise<Event_Simple>): Promise<Event_Simple>;
    /**
    * Gets a list of Elimination Alliances for the given Event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventAlliances(event_key: string, onCashExpire?: getPromise<Elimination_Alliance[]>): Promise<Elimination_Alliance[]>;
    /**
    * Gets a set of Event-specific insights for the given Event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventInsights(event_key: string, onCashExpire?: getPromise<{
        [key: string]: any;
    }>): Promise<{
        [key: string]: any;
    }>;
    /**
    * Gets a set of Event OPRs (including OPR, DPR, and CCWM) for the given Event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventOprs(event_key: string, onCashExpire?: getPromise<Event_OPRs>): Promise<Event_OPRs>;
    /**
    * Gets information on TBA-generated predictions for the given Event. Contains year-specific information. *WARNING* This endpoint is currently under development and may change at any time.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventPredictions(event_key: string, onCashExpire?: getPromise<Event_Predictions>): Promise<Event_Predictions>;
    /**
    * Gets a list of team rankings for the Event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventRankings(event_key: string, onCashExpire?: getPromise<Event_Ranking>): Promise<Event_Ranking>;
    /**
    * Gets a list of team rankings for the Event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventDistrict_points(event_key: string, onCashExpire?: getPromise<Event_District_Points>): Promise<Event_District_Points>;
    /**
    * Gets a list of `Team` objects that competed in the given event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventTeams(event_key: string, onCashExpire?: getPromise<Team[]>): Promise<Team[]>;
    /**
    * Gets a short-form list of `Team` objects that competed in the given event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventTeamsSimple(event_key: string, onCashExpire?: getPromise<Team_Simple[]>): Promise<Team_Simple[]>;
    /**
    * Gets a list of `Team` keys that competed in the given event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventTeamsKeys(event_key: string, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets a key-value list of the event statuses for teams competing at the given event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventTeamsStatuses(event_key: string, onCashExpire?: getPromise<{
        [event_key: string]: Team_Event_Status;
    }>): Promise<{
        [event_key: string]: Team_Event_Status;
    }>;
    /**
    * Gets a list of matches for the given event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventMatches(event_key: string, onCashExpire?: getPromise<Match[]>): Promise<Match[]>;
    /**
    * Gets a short-form list of matches for the given event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventMatchesSimple(event_key: string, onCashExpire?: getPromise<Match_Simple[]>): Promise<Match_Simple[]>;
    /**
    * Gets a list of match keys for the given event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventMatchesKeys(event_key: string, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets an array of Match Keys for the given event key that have timeseries data. Returns an empty array if no matches have timeseries data.
    *
    * *WARNING:* This is *not* official data, and is subject to a significant possibility of error, or missing data. Do not rely on this data for any purpose. In fact, pretend we made it up.
    *
    * *WARNING:* This endpoint and corresponding data models are under *active development* and may change at any time, including in breaking ways.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventMatchesTimeseries(event_key: string, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets a list of awards from the given event.
    *
    * @param event_key TBA Event Key, eg `2016nytr`
    * @param onCashExpire Get new promise once the cash expires
    */
    EventAwards(event_key: string, onCashExpire?: getPromise<Award[]>): Promise<Award[]>;
    /**
    * Gets a `Match` object for the given match key.
    *
    * @param match_key TBA Match Key, eg `2016nytr_qm1`
    * @param onCashExpire Get new promise once the cash expires
    */
    Match(match_key: string, onCashExpire?: getPromise<Match>): Promise<Match>;
    /**
    * Gets a short-form `Match` object for the given match key.
    *
    * @param match_key TBA Match Key, eg `2016nytr_qm1`
    * @param onCashExpire Get new promise once the cash expires
    */
    MatchSimple(match_key: string, onCashExpire?: getPromise<Match_Simple>): Promise<Match_Simple>;
    /**
    * Gets an array of game-specific Match Timeseries objects for the given match key or an empty array if not available.
    *
    * *WARNING:* This is *not* official data, and is subject to a significant possibility of error, or missing data. Do not rely on this data for any purpose. In fact, pretend we made it up.
    *
    * *WARNING:* This endpoint and corresponding data models are under *active development* and may change at any time, including in breaking ways.
    *
    * @param match_key TBA Match Key, eg `2016nytr_qm1`
    * @param onCashExpire Get new promise once the cash expires
    */
    MatchTimeseries(match_key: string, onCashExpire?: getPromise<{
        [key: string]: any;
    }[]>): Promise<{
        [key: string]: any;
    }[]>;
    /**
    * Gets a list of districts and their corresponding district key, for the given year.
    *
    * @param year Competition Year (or Season). Must be 4 digits.
    * @param onCashExpire Get new promise once the cash expires
    */
    Districts(year: number, onCashExpire?: getPromise<District_List[]>): Promise<District_List[]>;
    /**
    * Gets a list of events in the given district.
    *
    * @param district_key TBA District Key, eg `2016fim`
    * @param onCashExpire Get new promise once the cash expires
    */
    DistrictEvents(district_key: string, onCashExpire?: getPromise<Event[]>): Promise<Event[]>;
    /**
    * Gets a short-form list of events in the given district.
    *
    * @param district_key TBA District Key, eg `2016fim`
    * @param onCashExpire Get new promise once the cash expires
    */
    DistrictEventsSimple(district_key: string, onCashExpire?: getPromise<Event_Simple[]>): Promise<Event_Simple[]>;
    /**
    * Gets a list of event keys for events in the given district.
    *
    * @param district_key TBA District Key, eg `2016fim`
    * @param onCashExpire Get new promise once the cash expires
    */
    DistrictEventsKeys(district_key: string, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets a list of `Team` objects that competed in events in the given district.
    *
    * @param district_key TBA District Key, eg `2016fim`
    * @param onCashExpire Get new promise once the cash expires
    */
    DistrictTeams(district_key: string, onCashExpire?: getPromise<Team[]>): Promise<Team[]>;
    /**
    * Gets a short-form list of `Team` objects that competed in events in the given district.
    *
    * @param district_key TBA District Key, eg `2016fim`
    * @param onCashExpire Get new promise once the cash expires
    */
    DistrictTeamsSimple(district_key: string, onCashExpire?: getPromise<Team_Simple[]>): Promise<Team_Simple[]>;
    /**
    * Gets a list of `Team` objects that competed in events in the given district.
    *
    * @param district_key TBA District Key, eg `2016fim`
    * @param onCashExpire Get new promise once the cash expires
    */
    DistrictTeamsKeys(district_key: string, onCashExpire?: getPromise<string[]>): Promise<string[]>;
    /**
    * Gets a list of team district rankings for the given district.
    *
    * @param district_key TBA District Key, eg `2016fim`
    * @param onCashExpire Get new promise once the cash expires
    */
    DistrictRankings(district_key: string, onCashExpire?: getPromise<District_Ranking[]>): Promise<District_Ranking[]>;
}
export interface API_Status {
    /** Year of the current FRC season. */
    current_season: number;
    /** Maximum FRC season year for valid queries. */
    max_season: number;
    /** True if the entire FMS API provided by FIRST is down. */
    is_datafeed_down: boolean;
    /** An array of strings containing event keys of any active events that are no longer updating. */
    down_events: string[];
    ios: API_Status_App_Version;
    android: API_Status_App_Version;
}
export interface API_Status_App_Version {
    /** Internal use - Minimum application version required to correctly connect and process data. */
    min_app_version: number;
    /** Internal use - Latest application version available. */
    latest_app_version: number;
}
export interface Team_Simple {
    /** TBA team key with the format `frcXXXX` with `XXXX` representing the team number. */
    key: string;
    /** Official team number issued by FIRST. */
    team_number: number;
    /** Team nickname provided by FIRST. */
    nickname?: string;
    /** Official long name registered with FIRST. */
    name: string;
    /** City of team derived from parsing the address registered with FIRST. */
    city?: string;
    /** State of team derived from parsing the address registered with FIRST. */
    state_prov?: string;
    /** Country of team derived from parsing the address registered with FIRST. */
    country?: string;
}
export interface Team {
    /** TBA team key with the format `frcXXXX` with `XXXX` representing the team number. */
    key: string;
    /** Official team number issued by FIRST. */
    team_number: number;
    /** Team nickname provided by FIRST. */
    nickname?: string;
    /** Official long name registered with FIRST. */
    name: string;
    /** City of team derived from parsing the address registered with FIRST. */
    city?: string;
    /** State of team derived from parsing the address registered with FIRST. */
    state_prov?: string;
    /** Country of team derived from parsing the address registered with FIRST. */
    country?: string;
    /** Will be NULL, for future development. */
    address?: string;
    /** Postal code from the team address. */
    postal_code?: string;
    /** Will be NULL, for future development. */
    gmaps_place_id?: string;
    /** Will be NULL, for future development. */
    gmaps_url?: string;
    /** Will be NULL, for future development. */
    lat?: number;
    /** Will be NULL, for future development. */
    lng?: number;
    /** Will be NULL, for future development. */
    location_name?: string;
    /** Official website associated with the team. */
    website?: string;
    /** First year the team officially competed. */
    rookie_year: number;
    /** Team's motto as provided by FIRST. */
    motto?: string;
    /** Location of the team's home championship each year as a key-value pair. The year (as a string) is the key, and the city is the value. */
    home_championship?: {
        [key: string]: any;
    };
}
export interface Team_Robot {
    /** Year this robot competed in. */
    year: number;
    /** Name of the robot as provided by the team. */
    robot_name: string;
    /** Internal TBA identifier for this robot. */
    key: string;
    /** TBA team key for this robot. */
    team_key: string;
}
export interface Event_Simple {
    /** TBA event key with the format yyyy[EVENT_CODE], where yyyy is the year, and EVENT_CODE is the event code of the event. */
    key: string;
    /** Official name of event on record either provided by FIRST or organizers of offseason event. */
    name: string;
    /** Event short code, as provided by FIRST. */
    event_code: string;
    /** Event Type, as defined here: https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/event_type.py#L2 */
    event_type: number;
    district?: District_List;
    /** City, town, village, etc. the event is located in. */
    city?: string;
    /** State or Province the event is located in. */
    state_prov?: string;
    /** Country the event is located in. */
    country?: string;
    /** Event start date in `yyyy-mm-dd` format. */
    start_date: string;
    /** Event end date in `yyyy-mm-dd` format. */
    end_date: string;
    /** Year the event data is for. */
    year: number;
}
export interface Event {
    /** TBA event key with the format yyyy[EVENT_CODE], where yyyy is the year, and EVENT_CODE is the event code of the event. */
    key: string;
    /** Official name of event on record either provided by FIRST or organizers of offseason event. */
    name: string;
    /** Event short code, as provided by FIRST. */
    event_code: string;
    /** Event Type, as defined here: https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/event_type.py#L2 */
    event_type: number;
    district?: District_List;
    /** City, town, village, etc. the event is located in. */
    city?: string;
    /** State or Province the event is located in. */
    state_prov?: string;
    /** Country the event is located in. */
    country?: string;
    /** Event start date in `yyyy-mm-dd` format. */
    start_date: string;
    /** Event end date in `yyyy-mm-dd` format. */
    end_date: string;
    /** Year the event data is for. */
    year: number;
    /** Same as `name` but doesn't include event specifiers, such as 'Regional' or 'District'. May be null. */
    short_name?: string;
    /** Event Type, eg Regional, District, or Offseason. */
    event_type_string: string;
    /** Week of the event relative to the first official season event, zero-indexed. Only valid for Regionals, Districts, and District Championships. Null otherwise. (Eg. A season with a week 0 'preseason' event does not count, and week 1 events will show 0 here. Seasons with a week 0.5 regional event will show week 0 for those event(s) and week 1 for week 1 events and so on.) */
    week?: number;
    /** Address of the event's venue, if available. */
    address?: string;
    /** Postal code from the event address. */
    postal_code?: string;
    /** Google Maps Place ID for the event address. */
    gmaps_place_id?: string;
    /** Link to address location on Google Maps. */
    gmaps_url?: string;
    /** Latitude for the event address. */
    lat?: number;
    /** Longitude for the event address. */
    lng?: number;
    /** Name of the location at the address for the event, eg. Blue Alliance High School. */
    location_name?: string;
    /** Timezone name. */
    timezone?: string;
    /** The event's website, if any. */
    website?: string;
    /** The FIRST internal Event ID, used to link to the event on the FRC webpage. */
    first_event_id?: string;
    /** Public facing event code used by FIRST (on frc-events.firstinspires.org, for example) */
    first_event_code?: string;
    webcasts?: Webcast[];
    /** An array of event keys for the divisions at this event. */
    division_keys?: string[];
    /** The TBA Event key that represents the event's parent. Used to link back to the event from a division event. It is also the inverse relation of `divison_keys`. */
    parent_event_key?: string;
    /** Playoff Type, as defined here: https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/playoff_type.py#L4, or null. */
    playoff_type?: number;
    /** String representation of the `playoff_type`, or null. */
    playoff_type_string?: string;
}
export interface Team_Event_Status {
    qual?: Team_Event_Status_rank;
    alliance?: Team_Event_Status_alliance;
    playoff?: Team_Event_Status_playoff;
    /** An HTML formatted string suitable for display to the user containing the team's alliance pick status. */
    alliance_status_str?: string;
    /** An HTML formatter string suitable for display to the user containing the team's playoff status. */
    playoff_status_str?: string;
    /** An HTML formatted string suitable for display to the user containing the team's overall status summary of the event. */
    overall_status_str?: string;
    /** TBA match key for the next match the team is scheduled to play in at this event, or null. */
    next_match_key?: string;
    /** TBA match key for the last match the team played in at this event, or null. */
    last_match_key?: string;
}
export interface Team_Event_Status_rank {
    /** Number of teams ranked. */
    num_teams?: number;
    ranking?: {
        /** Number of matches the team was disqualified for. */
        dq?: number;
        /** Number of matches played. */
        matches_played?: number;
        /** For some years, average qualification score. Can be null. */
        qual_average?: number;
        /** Relative rank of this team. */
        rank?: number;
        record?: WLT_Record;
        /** Ordered list of values used to determine the rank. See the `sort_order_info` property for the name of each value. */
        sort_orders?: number[];
        /** TBA team key for this rank. */
        team_key?: string;
    };
    /** Ordered list of names corresponding to the elements of the `sort_orders` array. */
    sort_order_info?: {
        /** The descriptive name of the value used to sort the ranking. */
        name?: string;
        /** The number of digits of precision used for this value, eg `2` would correspond to a value of `101.11` while `0` would correspond to `101`. */
        precision?: number;
    }[];
    status?: string;
}
export interface Team_Event_Status_alliance {
    /** Alliance name, may be null. */
    name?: string;
    /** Alliance number. */
    number: number;
    backup?: Team_Event_Status_alliance_backup;
    /** Order the team was picked in the alliance from 0-2, with 0 being alliance captain. */
    pick: number;
}
/** Backup status, may be null. */
export interface Team_Event_Status_alliance_backup {
    /** TBA key for the team replaced by the backup. */
    out?: string;
    /** TBA key for the backup team called in. */
    in?: string;
}
/** Playoff status for this team, may be null if the team did not make playoffs, or playoffs have not begun. */
export interface Team_Event_Status_playoff {
    /** The highest playoff level the team reached. */
    level?: "qm" | "ef" | "qf" | "sf" | "f";
    current_level_record?: WLT_Record;
    record?: WLT_Record;
    /** Current competition status for the playoffs. */
    status?: "won" | "eliminated" | "playing";
    /** The average match score during playoffs. Year specific. May be null if not relevant for a given year. */
    playoff_average?: number;
}
export interface Event_Ranking {
    /** List of rankings at the event. */
    rankings: {
        /** Number of times disqualified. */
        dq: number;
        /** Number of matches played by this team. */
        matches_played: number;
        /** The average match score during qualifications. Year specific. May be null if not relevant for a given year. */
        qual_average?: number;
        /** The team's rank at the event as provided by FIRST. */
        rank: number;
        record: WLT_Record;
        /** Additional special data on the team's performance calculated by TBA. */
        extra_stats?: number[];
        /** Additional year-specific information, may be null. See parent `sort_order_info` for details. */
        sort_orders?: number[];
        /** The team with this rank. */
        team_key: string;
    }[];
    /** List of special TBA-generated values provided in the `extra_stats` array for each item. */
    extra_stats_info?: {
        /** Name of the field used in the `extra_stats` array. */
        name: string;
        /** Integer expressing the number of digits of precision in the number provided in `sort_orders`. */
        precision: number;
    }[];
    /** List of year-specific values provided in the `sort_orders` array for each team. */
    sort_order_info: {
        /** Name of the field used in the `sort_order` array. */
        name: string;
        /** Integer expressing the number of digits of precision in the number provided in `sort_orders`. */
        precision: number;
    }[];
}
export interface Event_District_Points {
    /** Points gained for each team at the event. Stored as a key-value pair with the team key as the key, and an object describing the points as its value. */
    points: {
        [team_key: string]: {
            /** Points awarded for alliance selection */
            alliance_points: number;
            /** Points awarded for event awards. */
            award_points: number;
            /** Points awarded for qualification match performance. */
            qual_points: number;
            /** Points awarded for elimination match performance. */
            elim_points: number;
            /** Total points awarded at this event. */
            total: number;
        };
    };
    /** Tiebreaker values for each team at the event. Stored as a key-value pair with the team key as the key, and an object describing the tiebreaker elements as its value. */
    tiebreakers?: {
        [team_key: string]: {
            highest_qual_scores?: number[];
            qual_wins?: number;
        };
    };
}
/** Insights for FIRST Stronghold qualification and elimination matches. */
export interface Event_Insights_2016 {
    qual?: Event_Insights_2016_Detail;
    playoff?: Event_Insights_2016_Detail;
}
export interface Event_Insights_2016_Detail {
    /** For the Low Bar - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
    LowBar: number[];
    /** For the Cheval De Frise - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
    A_ChevalDeFrise: number[];
    /** For the Portcullis - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
    A_Portcullis: number[];
    /** For the Ramparts - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
    B_Ramparts: number[];
    /** For the Moat - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
    B_Moat: number[];
    /** For the Sally Port - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
    C_SallyPort: number[];
    /** For the Drawbridge - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
    C_Drawbridge: number[];
    /** For the Rough Terrain - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
    D_RoughTerrain: number[];
    /** For the Rock Wall - An array with three values, number of times damaged, number of opportunities to damage, and percentage. */
    D_RockWall: number[];
    /** Average number of high goals scored. */
    average_high_goals: number;
    /** Average number of low goals scored. */
    average_low_goals: number;
    /** An array with three values, number of times breached, number of opportunities to breach, and percentage. */
    breaches: number[];
    /** An array with three values, number of times scaled, number of opportunities to scale, and percentage. */
    scales: number[];
    /** An array with three values, number of times challenged, number of opportunities to challenge, and percentage. */
    challenges: number[];
    /** An array with three values, number of times captured, number of opportunities to capture, and percentage. */
    captures: number[];
    /** Average winning score. */
    average_win_score: number;
    /** Average margin of victory. */
    average_win_margin: number;
    /** Average total score. */
    average_score: number;
    /** Average autonomous score. */
    average_auto_score: number;
    /** Average crossing score. */
    average_crossing_score: number;
    /** Average boulder score. */
    average_boulder_score: number;
    /** Average tower score. */
    average_tower_score: number;
    /** Average foul score. */
    average_foul_score: number;
    /** An array with three values, high score, match key from the match with the high score, and the name of the match. */
    high_score: string[];
}
/** Insights for FIRST STEAMWORKS qualification and elimination matches. */
export interface Event_Insights_2017 {
    qual?: Event_Insights_2017_Detail;
    playoff?: Event_Insights_2017_Detail;
}
export interface Event_Insights_2017_Detail {
    /** Average foul score. */
    average_foul_score: number;
    /** Average fuel points scored. */
    average_fuel_points: number;
    /** Average fuel points scored during auto. */
    average_fuel_points_auto: number;
    /** Average fuel points scored during teleop. */
    average_fuel_points_teleop: number;
    /** Average points scored in the high goal. */
    average_high_goals: number;
    /** Average points scored in the high goal during auto. */
    average_high_goals_auto: number;
    /** Average points scored in the high goal during teleop. */
    average_high_goals_teleop: number;
    /** Average points scored in the low goal. */
    average_low_goals: number;
    /** Average points scored in the low goal during auto. */
    average_low_goals_auto: number;
    /** Average points scored in the low goal during teleop. */
    average_low_goals_teleop: number;
    /** Average mobility points scored during auto. */
    average_mobility_points_auto: number;
    /** Average points scored during auto. */
    average_points_auto: number;
    /** Average points scored during teleop. */
    average_points_teleop: number;
    /** Average rotor points scored. */
    average_rotor_points: number;
    /** Average rotor points scored during auto. */
    average_rotor_points_auto: number;
    /** Average rotor points scored during teleop. */
    average_rotor_points_teleop: number;
    /** Average score. */
    average_score: number;
    /** Average takeoff points scored during teleop. */
    average_takeoff_points_teleop: number;
    /** Average margin of victory. */
    average_win_margin: number;
    /** Average winning score. */
    average_win_score: number;
    /** An array with three values, kPa scored, match key from the match with the high kPa, and the name of the match */
    high_kpa: string[];
    /** An array with three values, high score, match key from the match with the high score, and the name of the match */
    high_score: string[];
    /** An array with three values, number of times kPa bonus achieved, number of opportunities to bonus, and percentage. */
    kpa_achieved: number[];
    /** An array with three values, number of times mobility bonus achieved, number of opportunities to bonus, and percentage. */
    mobility_counts: number[];
    /** An array with three values, number of times rotor 1 engaged, number of opportunities to engage, and percentage. */
    rotor_1_engaged: number[];
    /** An array with three values, number of times rotor 1 engaged in auto, number of opportunities to engage in auto, and percentage. */
    rotor_1_engaged_auto: number[];
    /** An array with three values, number of times rotor 2 engaged, number of opportunities to engage, and percentage. */
    rotor_2_engaged: number[];
    /** An array with three values, number of times rotor 2 engaged in auto, number of opportunities to engage in auto, and percentage. */
    rotor_2_engaged_auto: number[];
    /** An array with three values, number of times rotor 3 engaged, number of opportunities to engage, and percentage. */
    rotor_3_engaged: number[];
    /** An array with three values, number of times rotor 4 engaged, number of opportunities to engage, and percentage. */
    rotor_4_engaged: number[];
    /** An array with three values, number of times takeoff was counted, number of opportunities to takeoff, and percentage. */
    takeoff_counts: number[];
}
/** OPR, DPR, and CCWM for teams at the event. */
export interface Event_OPRs {
    /** A key-value pair with team key (eg `frc254`) as key and OPR as value. */
    oprs?: {
        [team_key: string]: number;
    };
    /** A key-value pair with team key (eg `frc254`) as key and DPR as value. */
    dprs?: {
        [team_key: string]: number;
    };
    /** A key-value pair with team key (eg `frc254`) as key and CCWM as value. */
    ccwms?: {
        [team_key: string]: number;
    };
}
/** JSON Object containing prediction information for the event. Contains year-specific information and is subject to change. */
export interface Event_Predictions {
    [key: string]: any;
}
export interface Webcast {
    /** Type of webcast, typically descriptive of the streaming provider. */
    type: "youtube" | "twitch" | "ustream" | "iframe" | "html5" | "rtmp" | "livestream";
    /** Type specific channel information. May be the YouTube stream, or Twitch channel name. In the case of iframe types, contains HTML to embed the stream in an HTML iframe. */
    channel: string;
    /** File identification as may be required for some types. May be null. */
    file?: string;
}
export interface Match_Simple {
    /** TBA match key with the format `yyyy[EVENT_CODE]_[COMP_LEVEL]m[MATCH_NUMBER]`, where `yyyy` is the year, and `EVENT_CODE` is the event code of the event, `COMP_LEVEL` is (qm, ef, qf, sf, f), and `MATCH_NUMBER` is the match number in the competition level. A set number may append the competition level if more than one match in required per set. */
    key: string;
    /** The competition level the match was played at. */
    comp_level: "qm" | "ef" | "qf" | "sf" | "f";
    /** The set number in a series of matches where more than one match is required in the match series. */
    set_number: number;
    /** The match number of the match in the competition level. */
    match_number: number;
    /** A list of alliances, the teams on the alliances, and their score. */
    alliances?: {
        blue?: Match_alliance;
        red?: Match_alliance;
    };
    /** The color (red/blue) of the winning alliance. Will contain an empty string in the event of no winner, or a tie. */
    winning_alliance?: "red" | "blue";
    /** Event key of the event the match was played at. */
    event_key: string;
    /** UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the scheduled match time, as taken from the published schedule. */
    time?: number;
    /** UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the TBA predicted match start time. */
    predicted_time?: number;
    /** UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of actual match start time. */
    actual_time?: number;
}
export interface Match {
    /** TBA match key with the format `yyyy[EVENT_CODE]_[COMP_LEVEL]m[MATCH_NUMBER]`, where `yyyy` is the year, and `EVENT_CODE` is the event code of the event, `COMP_LEVEL` is (qm, ef, qf, sf, f), and `MATCH_NUMBER` is the match number in the competition level. A set number may be appended to the competition level if more than one match in required per set. */
    key: string;
    /** The competition level the match was played at. */
    comp_level: "qm" | "ef" | "qf" | "sf" | "f";
    /** The set number in a series of matches where more than one match is required in the match series. */
    set_number: number;
    /** The match number of the match in the competition level. */
    match_number: number;
    /** A list of alliances, the teams on the alliances, and their score. */
    alliances?: {
        blue?: Match_alliance;
        red?: Match_alliance;
    };
    /** The color (red/blue) of the winning alliance. Will contain an empty string in the event of no winner, or a tie. */
    winning_alliance?: string;
    /** Event key of the event the match was played at. */
    event_key: string;
    /** UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the scheduled match time, as taken from the published schedule. */
    time?: number;
    /** UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of actual match start time. */
    actual_time?: number;
    /** UNIX timestamp (seconds since 1-Jan-1970 00:00:00) of the TBA predicted match start time. */
    predicted_time?: number;
    /** UNIX timestamp (seconds since 1-Jan-1970 00:00:00) when the match result was posted. */
    post_result_time?: number;
    /** Score breakdown for auto, teleop, etc. points. Varies from year to year. May be null. */
    score_breakdown?: {
        [key: string]: any;
    };
    /** Array of video objects associated with this match. */
    videos?: {
        /** Unique key representing this video */
        key?: string;
        /** Can be one of 'youtube' or 'tba' */
        type?: string;
    }[];
}
export interface Match_alliance {
    /** Score for this alliance. Will be null or -1 for an unplayed match. */
    score: number;
    team_keys: string[];
    /** TBA team keys (eg `frc254`) of any teams playing as a surrogate. */
    surrogate_team_keys?: string[];
    /** TBA team keys (eg `frc254`) of any disqualified teams. */
    dq_team_keys?: string[];
}
/** See the 2015 FMS API documentation for a description of each value */
export interface Match_Score_Breakdown_2015 {
    blue?: Match_Score_Breakdown_2015_Alliance;
    red?: Match_Score_Breakdown_2015_Alliance;
    coopertition?: "None" | "Unknown" | "Stack";
    coopertition_points?: number;
}
export interface Match_Score_Breakdown_2015_Alliance {
    auto_points?: number;
    teleop_points?: number;
    container_points?: number;
    tote_points?: number;
    litter_points?: number;
    foul_points?: number;
    adjust_points?: number;
    total_points?: number;
    foul_count?: number;
    tote_count_far?: number;
    tote_count_near?: number;
    tote_set?: boolean;
    tote_stack?: boolean;
    container_count_level1?: number;
    container_count_level2?: number;
    container_count_level3?: number;
    container_count_level4?: number;
    container_count_level5?: number;
    container_count_level6?: number;
    container_set?: boolean;
    litter_count_container?: number;
    litter_count_landfill?: number;
    litter_count_unprocessed?: number;
    robot_set?: boolean;
}
/** See the 2016 FMS API documentation for a description of each value. */
export interface Match_Score_Breakdown_2016 {
    blue?: Match_Score_Breakdown_2016_Alliance;
    red?: Match_Score_Breakdown_2016_Alliance;
}
export interface Match_Score_Breakdown_2016_Alliance {
    autoPoints?: number;
    teleopPoints?: number;
    breachPoints?: number;
    foulPoints?: number;
    capturePoints?: number;
    adjustPoints?: number;
    totalPoints?: number;
    robot1Auto?: "Crossed" | "Reached" | "None";
    robot2Auto?: "Crossed" | "Reached" | "None";
    robot3Auto?: "Crossed" | "Reached" | "None";
    autoReachPoints?: number;
    autoCrossingPoints?: number;
    autoBouldersLow?: number;
    autoBouldersHigh?: number;
    autoBoulderPoints?: number;
    teleopCrossingPoints?: number;
    teleopBouldersLow?: number;
    teleopBouldersHigh?: number;
    teleopBoulderPoints?: number;
    teleopDefensesBreached?: boolean;
    teleopChallengePoints?: number;
    teleopScalePoints?: number;
    teleopTowerCaptured?: number;
    towerFaceA?: string;
    towerFaceB?: string;
    towerFaceC?: string;
    towerEndStrength?: number;
    techFoulCount?: number;
    foulCount?: number;
    position2?: string;
    position3?: string;
    position4?: string;
    position5?: string;
    position1crossings?: number;
    position2crossings?: number;
    position3crossings?: number;
    position4crossings?: number;
    position5crossings?: number;
}
/** See the 2017 FMS API documentation for a description of each value. */
export interface Match_Score_Breakdown_2017 {
    blue?: Match_Score_Breakdown_2017_Alliance;
    red?: Match_Score_Breakdown_2017_Alliance;
}
export interface Match_Score_Breakdown_2017_Alliance {
    autoPoints?: number;
    teleopPoints?: number;
    foulPoints?: number;
    adjustPoints?: number;
    totalPoints?: number;
    robot1Auto?: "Unknown" | "Mobility" | "None";
    robot2Auto?: "Unknown" | "Mobility" | "None";
    robot3Auto?: "Unknown" | "Mobility" | "None";
    rotor1Auto?: boolean;
    rotor2Auto?: boolean;
    autoFuelLow?: number;
    autoFuelHigh?: number;
    autoMobilityPoints?: number;
    autoRotorPoints?: number;
    autoFuelPoints?: number;
    teleopFuelPoints?: number;
    teleopFuelLow?: number;
    teleopFuelHigh?: number;
    teleopRotorPoints?: number;
    kPaRankingPointAchieved?: boolean;
    teleopTakeoffPoints?: number;
    kPaBonusPoints?: number;
    rotorBonusPoints?: number;
    rotor1Engaged?: boolean;
    rotor2Engaged?: boolean;
    rotor3Engaged?: boolean;
    rotor4Engaged?: boolean;
    rotorRankingPointAchieved?: boolean;
    techFoulCount?: number;
    foulCount?: number;
    touchpadNear?: string;
    touchpadMiddle?: string;
    touchpadFar?: string;
}
/** See the 2018 FMS API documentation for a description of each value. */
export interface Match_Score_Breakdown_2018 {
    blue?: Match_Score_Breakdown_2018_Alliance;
    red?: Match_Score_Breakdown_2018_Alliance;
}
export interface Match_Score_Breakdown_2018_Alliance {
    adjustPoints?: number;
    autoOwnershipPoints?: number;
    autoPoints?: number;
    autoQuestRankingPoint?: boolean;
    autoRobot1?: string;
    autoRobot2?: string;
    autoRobot3?: string;
    autoRunPoints?: number;
    autoScaleOwnershipSec?: number;
    autoSwitchAtZero?: boolean;
    autoSwitchOwnershipSec?: number;
    endgamePoints?: number;
    endgameRobot1?: string;
    endgameRobot2?: string;
    endgameRobot3?: string;
    faceTheBossRankingPoint?: boolean;
    foulCount?: number;
    foulPoints?: number;
    rp?: number;
    techFoulCount?: number;
    teleopOwnershipPoints?: number;
    teleopPoints?: number;
    teleopScaleBoostSec?: number;
    teleopScaleForceSec?: number;
    teleopScaleOwnershipSec?: number;
    teleopSwitchBoostSec?: number;
    teleopSwitchForceSec?: number;
    teleopSwitchOwnershipSec?: number;
    totalPoints?: number;
    vaultBoostPlayed?: number;
    vaultBoostTotal?: number;
    vaultForcePlayed?: number;
    vaultForceTotal?: number;
    vaultLevitatePlayed?: number;
    vaultLevitateTotal?: number;
    vaultPoints?: number;
    /** Unofficial TBA-computed value of the FMS provided GameData given to the alliance teams at the start of the match. 3 Character String containing `L` and `R` only. The first character represents the near switch, the 2nd the scale, and the 3rd the far, opposing, switch from the alliance's perspective. An `L` in a position indicates the platform on the left will be lit for the alliance while an `R` will indicate the right platform will be lit for the alliance. See also [WPI Screen Steps](https://wpilib.screenstepslive.com/s/currentCS/m/getting_started/l/826278-2018-game-data-details). */
    tba_gameData?: string;
}
/**
* Timeseries data for the 2018 game *FIRST* POWER UP.
*
* *WARNING:* This is *not* official data, and is subject to a significant possibility of error, or missing data. Do not rely on this data for any purpose. In fact, pretend we made it up.
*
* *WARNING:* This model is currently under active development and may change at any time, including in breaking ways.
*/
export interface Match_Timeseries_2018 {
    /** TBA event key with the format yyyy[EVENT_CODE], where yyyy is the year, and EVENT_CODE is the event code of the event. */
    event_key?: string;
    /** Match ID consisting of the level, match number, and set number, eg `q45` or `f1m1`. */
    match_id?: string;
    /** Current mode of play, can be `pre_match`, `auto`, `telop`, or `post_match`. */
    mode?: string;
    play?: number;
    /** Amount of time remaining in the match, only valid during `auto` and `teleop` modes. */
    time_remaining?: number;
    /** 1 if the blue alliance is credited with the AUTO QUEST, 0 if not. */
    blue_auto_quest?: number;
    /** Number of POWER CUBES in the BOOST section of the blue alliance VAULT. */
    blue_boost_count?: number;
    /** Number of POWER CUBES in the BOOST section of the blue alliance VAULT when BOOST was played, or 0 if not played. */
    blue_boost_played?: number;
    /** Name of the current blue alliance POWER UP being played, or `null`. */
    blue_current_powerup?: string;
    /** 1 if the blue alliance is credited with FACING THE BOSS, 0 if not. */
    blue_face_the_boss?: number;
    /** Number of POWER CUBES in the FORCE section of the blue alliance VAULT. */
    blue_force_count?: number;
    /** Number of POWER CUBES in the FORCE section of the blue alliance VAULT when FORCE was played, or 0 if not played. */
    blue_force_played?: number;
    /** Number of POWER CUBES in the LEVITATE section of the blue alliance VAULT. */
    blue_levitate_count?: number;
    /** Number of POWER CUBES in the LEVITATE section of the blue alliance VAULT when LEVITATE was played, or 0 if not played. */
    blue_levitate_played?: number;
    /** Number of seconds remaining in the blue alliance POWER UP time, or 0 if none is active. */
    blue_powerup_time_remaining?: string;
    /** 1 if the blue alliance owns the SCALE, 0 if not. */
    blue_scale_owned?: number;
    /** Current score for the blue alliance. */
    blue_score?: number;
    /** 1 if the blue alliance owns their SWITCH, 0 if not. */
    blue_switch_owned?: number;
    /** 1 if the red alliance is credited with the AUTO QUEST, 0 if not. */
    red_auto_quest?: number;
    /** Number of POWER CUBES in the BOOST section of the red alliance VAULT. */
    red_boost_count?: number;
    /** Number of POWER CUBES in the BOOST section of the red alliance VAULT when BOOST was played, or 0 if not played. */
    red_boost_played?: number;
    /** Name of the current red alliance POWER UP being played, or `null`. */
    red_current_powerup?: string;
    /** 1 if the red alliance is credited with FACING THE BOSS, 0 if not. */
    red_face_the_boss?: number;
    /** Number of POWER CUBES in the FORCE section of the red alliance VAULT. */
    red_force_count?: number;
    /** Number of POWER CUBES in the FORCE section of the red alliance VAULT when FORCE was played, or 0 if not played. */
    red_force_played?: number;
    /** Number of POWER CUBES in the LEVITATE section of the red alliance VAULT. */
    red_levitate_count?: number;
    /** Number of POWER CUBES in the LEVITATE section of the red alliance VAULT when LEVITATE was played, or 0 if not played. */
    red_levitate_played?: number;
    /** Number of seconds remaining in the red alliance POWER UP time, or 0 if none is active. */
    red_powerup_time_remaining?: string;
    /** 1 if the red alliance owns the SCALE, 0 if not. */
    red_scale_owned?: number;
    /** Current score for the red alliance. */
    red_score?: number;
    /** 1 if the red alliance owns their SWITCH, 0 if not. */
    red_switch_owned?: number;
}
/** The `Media` object contains a reference for most any media associated with a team or event on TBA. */
export interface Media {
    /** TBA identifier for this media. */
    key: string;
    /** String type of the media element. */
    type: "youtube" | "cdphotothread" | "imgur" | "facebook-profile" | "youtube-channel" | "twitter-profile" | "github-profile" | "instagram-profile" | "periscope-profile" | "grabcad" | "instagram-image" | "external-link" | "avatar";
    /** The key used to identify this media on the media site. */
    foreign_key?: string;
    /** If required, a JSON dict of additional media information. */
    details?: {
        [key: string]: any;
    };
    /** True if the media is of high quality. */
    preferred?: boolean;
}
export interface Elimination_Alliance {
    /** Alliance name, may be null. */
    name?: string;
    /** Backup team called in, may be null. */
    backup?: {
        /** Team key that was replaced by the backup team. */
        out?: string;
        /** Team key that was called in as the backup. */
        in?: string;
    };
    /** List of teams that declined the alliance. */
    declines?: string[];
    /** List of team keys picked for the alliance. First pick is captain. */
    picks: string[];
    status?: {
        current_level_record?: WLT_Record;
        level?: string;
        playoff_average?: number;
        record?: WLT_Record;
        status?: string;
    };
}
export interface Award {
    /** The name of the award as provided by FIRST. May vary for the same award type. */
    name: string;
    /** Type of award given. See https://github.com/the-blue-alliance/the-blue-alliance/blob/master/consts/award_type.py#L6 */
    award_type: number;
    /** The event_key of the event the award was won at. */
    event_key: string;
    /** A list of recipients of the award at the event. Either team_key and/or awardee for individual awards. */
    recipient_list: Award_Recipient[];
    /** The year this award was won. */
    year: number;
}
/** An `Award_Recipient` object represents the team and/or person who received an award at an event. */
export interface Award_Recipient {
    /** The TBA team key for the team that was given the award. May be null. */
    team_key?: string;
    /** The name of the individual given the award. May be null. */
    awardee?: string;
}
export interface District_List {
    /** The short identifier for the district. */
    abbreviation: string;
    /** The long name for the district. */
    display_name: string;
    /** Key for this district, e.g. `2016ne`. */
    key: string;
    /** Year this district participated. */
    year: number;
}
/** Rank of a team in a district. */
export interface District_Ranking {
    /** TBA team key for the team. */
    team_key: string;
    /** Numerical rank of the team, 1 being top rank. */
    rank: number;
    /** Any points added to a team as a result of the rookie bonus. */
    rookie_bonus?: number;
    /** Total district points for the team. */
    point_total: number;
    /** List of events that contributed to the point total for the team. */
    event_points?: {
        /** TBA Event key for this event. */
        event_key: string;
        /** `true` if this event is a District Championship event. */
        district_cmp: boolean;
        /** Points awarded for alliance selection. */
        alliance_points: number;
        /** Points awarded for event awards. */
        award_points: number;
        /** Points awarded for qualification match performance. */
        qual_points: number;
        /** Points awarded for elimination match performance. */
        elim_points: number;
        /** Total points awarded at this event. */
        total: number;
    }[];
}
/** A Win-Loss-Tie record for a team, or an alliance. */
export interface WLT_Record {
    /** Number of losses. */
    losses: number;
    /** Number of wins. */
    wins: number;
    /** Number of ties. */
    ties: number;
}
