const KeyManager = require('./KeyManager');

var key_manager;
var aws_region;
var userpool_id;

describe('KeyManager', () => {
	beforeEach(() => {
		key_manager = new KeyManager();
		aws_region = 'fake_region';
		userpool_id = 'fake_userpool_id';
	});
	describe('getKey()', () => {
		test('adds key to cache when one is found', async () => {
			let key_id = 'anotherKeyIdThatExists';
			expect(key_manager.key_cache[key_id]).toBe(undefined);
			let found_key = await key_manager.getKey({key_id, aws_region, userpool_id});
			expect(key_manager.key_cache[key_id]).not.toBe(undefined);
			expect(found_key).toBe(key_manager.key_cache[key_id]);
		});

		test('does not cache anything if key doesn\'t exist', async () => {
			let key_id = 'nonexistentKey';
			return key_manager.getKey({key_id, aws_region, userpool_id})
				.catch(e => expect(e).toMatch('Key ID not found at the provided URL.'));
		});

		test('resolves with cached key if it exists', async () => {
			let key_id = 'cachedKey';
			key_manager.key_cache[key_id] = {
				kid: key_id
			}
			let found_key = await key_manager.getKey({key_id, aws_region, userpool_id});
			expect(found_key).not.toBe(undefined);
		});
	});
});
