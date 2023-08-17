// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface DataRelationsOfPokemonTypes {
  damage_relations:      DamageRelations;
  game_indices:          GameIndex[];
  generation:            Generation;
  id:                    number;
  move_damage_class:     Generation;
  moves:                 Generation[];
  name:                  string;
  names:                 Name[];
  past_damage_relations: PastDamageRelation[];
  pokemon:               Pokemon[];
}

export interface DamageRelations {
  double_damage_from: Generation[];
  double_damage_to:   Generation[];
  half_damage_from:   Generation[];
  half_damage_to:     Generation[];
  no_damage_from:     Generation[];
  no_damage_to:       Generation[];
}

export interface Generation {
  name: string;
  url:  string;
}

export interface GameIndex {
  game_index: number;
  generation: Generation;
}

export interface Name {
  language: Generation;
  name:     string;
}

export interface PastDamageRelation {
  damage_relations: DamageRelations;
  generation:       Generation;
}

export interface Pokemon {
  pokemon: Generation;
  slot:    number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toWelcome(json: string): Welcome {
      return cast(JSON.parse(json), r("Welcome"));
  }

  public static welcomeToJson(value: Welcome): string {
      return JSON.stringify(uncast(value, r("Welcome")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
      if (typ.length === 2 && typ[0] === undefined) {
          return `an optional ${prettyTypeName(typ[1])}`;
      } else {
          return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
      }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
      return typ.literal;
  } else {
      return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
      typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
      const map: any = {};
      typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
      typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
      if (typeof typ === typeof val) return val;
      return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
      // val must validate against one typ in typs
      const l = typs.length;
      for (let i = 0; i < l; i++) {
          const typ = typs[i];
          try {
              return transform(val, typ, getProps);
          } catch (_) {}
      }
      return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
      if (cases.indexOf(val) !== -1) return val;
      return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
  }

  function transformArray(typ: any, val: any): any {
      // val must be an array with no invalid elements
      if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
      return val.map(el => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
      if (val === null) {
          return null;
      }
      const d = new Date(val);
      if (isNaN(d.valueOf())) {
          return invalidValue(l("Date"), val, key, parent);
      }
      return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
      if (val === null || typeof val !== "object" || Array.isArray(val)) {
          return invalidValue(l(ref || "object"), val, key, parent);
      }
      const result: any = {};
      Object.getOwnPropertyNames(props).forEach(key => {
          const prop = props[key];
          const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
          result[prop.key] = transform(v, prop.typ, getProps, key, ref);
      });
      Object.getOwnPropertyNames(val).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(props, key)) {
              result[key] = transform(val[key], additional, getProps, key, ref);
          }
      });
      return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
      if (val === null) return val;
      return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
      ref = typ.ref;
      typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
      return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
          : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
          : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  "Welcome": o([
      { json: "damage_relations", js: "damage_relations", typ: r("DamageRelations") },
      { json: "game_indices", js: "game_indices", typ: a(r("GameIndex")) },
      { json: "generation", js: "generation", typ: r("Generation") },
      { json: "id", js: "id", typ: 0 },
      { json: "move_damage_class", js: "move_damage_class", typ: r("Generation") },
      { json: "moves", js: "moves", typ: a(r("Generation")) },
      { json: "name", js: "name", typ: "" },
      { json: "names", js: "names", typ: a(r("Name")) },
      { json: "past_damage_relations", js: "past_damage_relations", typ: a(r("PastDamageRelation")) },
      { json: "pokemon", js: "pokemon", typ: a(r("Pokemon")) },
  ], false),
  "DamageRelations": o([
      { json: "double_damage_from", js: "double_damage_from", typ: a(r("Generation")) },
      { json: "double_damage_to", js: "double_damage_to", typ: a(r("Generation")) },
      { json: "half_damage_from", js: "half_damage_from", typ: a(r("Generation")) },
      { json: "half_damage_to", js: "half_damage_to", typ: a(r("Generation")) },
      { json: "no_damage_from", js: "no_damage_from", typ: a("any") },
      { json: "no_damage_to", js: "no_damage_to", typ: a(r("Generation")) },
  ], false),
  "Generation": o([
      { json: "name", js: "name", typ: "" },
      { json: "url", js: "url", typ: "" },
  ], false),
  "GameIndex": o([
      { json: "game_index", js: "game_index", typ: 0 },
      { json: "generation", js: "generation", typ: r("Generation") },
  ], false),
  "Name": o([
      { json: "language", js: "language", typ: r("Generation") },
      { json: "name", js: "name", typ: "" },
  ], false),
  "PastDamageRelation": o([
      { json: "damage_relations", js: "damage_relations", typ: r("DamageRelations") },
      { json: "generation", js: "generation", typ: r("Generation") },
  ], false),
  "Pokemon": o([
      { json: "pokemon", js: "pokemon", typ: r("Generation") },
      { json: "slot", js: "slot", typ: 0 },
  ], false),
};
