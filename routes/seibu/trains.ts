import { sift, uuid, dateFnsTz } from "../../deps.ts";
import { master, TrainsResponse } from "./constant.ts";

export const seibuOdptTrains: sift.Handler = async (req, params) => {
  const lineKeys: string[] = [];
  switch (params.line) {
    case "ike":
    case "sin":
    case "tam":
      lineKeys.concat(master.line.reduce((acc, line) => {
        if (line.lineGroupId === params.line) acc.push(line.lineId);
        return acc;
      }, Array<string>()))
      break;
    case "ikebukuro": lineKeys.push("L001"); break;
    case "sayama":    lineKeys.push("L002"); break;
    case "toshima":   lineKeys.push("L003"); break;
    case "yurakucho": lineKeys.push("L005"); break;
    case "chichibu":  lineKeys.push("L008"); break;
    case "shinjuku":  lineKeys.push("L009"); break;
    case "seibuen":   lineKeys.push("L010"); break;
    case "haijima":   lineKeys.push("L011"); break;
    case "kokubunji": lineKeys.push("L012"); break;
    case "tamako":    lineKeys.push("L013"); break;
    case "tamagawa":  lineKeys.push("L021"); break;
    case "yamaguchi": lineKeys.push("L022"); break;
    default: lineKeys.concat(["L001", "L002", "L003", "L004", "L005", "L006", "L007", "L008", "L009", "L010", "L011", "L012", "L013", "L021", "L022"]);
  }

  const res = await fetch(`https://train.seibuapp.jp/trainfo-api/ti/v1.0/trains?lineId=${lineKeys.join("+")}`);
  if (!res.ok) {
    return new Response(
      JSON.stringify({ status: 500, message: "Getting data failed." }),
      { status: 500, headers: { "content-type": "application/json; charset=UTF-8" } }
    );
  } else {
    const json = await res.json() as TrainsResponse;
    if (json.total === 0) {
      return sift.json(json.train);
    } else {
      const data = json.train.map(tr => {
        const convertStation = (
          line: keyof typeof master.odpt.line,
          station: keyof typeof master.odpt.station,
        ) => `odpt.Station:${master.odpt.line[line]}.${master.odpt.station[station]}`;

        const generateEdgeStation = (
          currentLine: keyof typeof master.odpt.line,
          edgeStation: keyof typeof master.odpt.station,
        ) => {
          const staOnSeibu = master.station.reduce((acc, sta) => {
            if (sta.onSeibuLine) acc.push(sta.stationId);
            return acc;
          }, Array<string>());
          if (!staOnSeibu.includes(edgeStation)) {
            const candidates = master.stationLine.filter(sta => sta.stationId === edgeStation);
            if (candidates.length === 1) {
              const candidate = candidates[0];
              // @ts-ignore: type limitation too strict
              return `odpt.Station:${master.odpt.line[candidate.lineId]}.${master.odpt.station[edgeStation]}`;
            } else if (candidates.length === 0) {
              return;
            } else {
              // @ts-ignore: type limitation too strict
              return `odpt.Station:${master.odpt.line(currentLine)}.${master.odpt.station[edgeStation]}`;
            }
          } else {
            // @ts-ignore: type limitation too strict
            const lineGroupKey: string = master.line[currentLine].lineGroupId;
            const currentLineGroup = master.line.reduce((acc, line) => {
              if (line.lineGroupId === lineGroupKey) {
                acc.push(line.lineId);
              }
              return acc;
            }, Array<string>());
            const candidates = master.stationLine.filter(sta => sta.stationId === edgeStation && currentLineGroup.includes(sta.lineId));
            if (candidates.length === 1) {
              const candidate = candidates[0];
              // @ts-ignore: type limitation too strict
              return `odpt.Station:${master.odpt.line[candidate.lineId]}.${master.odpt.station[edgeStation]}`;
            } else if (candidates.length === 0) {
              return;
            } else {
              // @ts-ignore: type limitation too strict
              return `odpt.Station:${master.odpt.line(currentLine)}.${master.odpt.station[edgeStation]}`;
            }
          }
        }

        const line = master.odpt.line[tr.lineId];
        const type = master.odpt.trainType.get(Number(tr.trainType))!;
        const owner = tr.carType === null ? null : master.odpt.trainOwner.get(tr.carType) || "Seibu";

        const obj = {
          "@id": `urn:uuid:${uuid.v4.generate()}`,
          "@type": "odpt:Train",
          "dc:date": dateFnsTz.format(
            dateFnsTz.utcToZonedTime(new Date(res.headers.get("date")!), 'Asia/Tokyo'),
            "yyyy-MM-dd HH:mm:ssxxx",
            { timeZone: 'Asia/Tokyo' }
          ).split(" ").join("T"),
          "@context": "http://vocab.odpt.org/context_odpt.jsonld",
          "owl:sameAs": `odpt.Train:Seibu.${line}.${tr.trainNo}`,
          "odpt:operator": "odpt.Operator:Seibu",
          "odpt:railway": `odpt.Railway:${line}`,
          "odpt:railDirection": `odpt.RailDirection:${tr.direction === "up" ? "Outbound" : "Inbound"}`,
          "odpt:trainNumber": tr.trainNo,
          "odpt:trainType": type,
          "odpt:fromStation": tr.fromStationId === null ? null : convertStation(tr.lineId, tr.fromStationId),
          "odpt:toStation": tr.toStationId === null ? null : convertStation(tr.lineId, tr.toStationId),
          "odpt:originStation": [
            generateEdgeStation(tr.lineId, tr.starting)
          ],
          "odpt:destinationStation": [
            generateEdgeStation(tr.lineId, tr.destination)
          ],
          "odpt:trainOwner": owner,
          "odpt:delay": tr.delay * 60,
          "odpt:carComposition": Number(tr.numberOfCars),
        };

        if (!tr.trainName?.match(/\d{1,4}列車/)) {
          // @ts-ignore: add extra property
          obj["odpt:trainName"] = [{ ja: tr.trainName }];
        }

        if (tr.note) {
          // @ts-ignore: add extra property
          obj["odpt:note"] = [{ ja: tr.note }];
        }

        return obj;
      });
      return sift.json(data);
    }
  }
};
