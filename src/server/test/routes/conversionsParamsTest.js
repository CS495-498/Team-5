/* This Source Code Form is subject to the terms of the Mozilla Public
      * License, v. 2.0. If a copy of the MPL was not distributed with this
      * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

      const { expect } = require('chai');
      const { chai, mocha, app, testDB } = require('../common');
 
      // Test endpoints
      const EDIT_CONVERSION = '/api/conversions/edit';
      const ADD_CONVERSION = '/api/conversions/addConversion';
      const DELETE_CONVERSION = '/api/conversions/delete';
 
      // Helper function to test invalid field values
      async function testInvalidField({ field, invalidValue, endpoint, basePayload, expectedStatus = 400 }) {
        const payload = { ...basePayload, [field]: invalidValue };
        const res = await chai.request(app).post(endpoint).send(payload);
        expect(res).to.have.status(expectedStatus);
      }
 
      // Helper function to test integer field validation
      async function validateInt({ field, endpoint, basePayload, required = true, min = null, max = null }) {
        if (required) {
          // Test missing required field
          const payloadWithoutField = { ...basePayload };
          delete payloadWithoutField[field];
          const res = await chai.request(app).post(endpoint).send(payloadWithoutField);
          expect(res).to.have.status(400);
        }
 
        // Test non-integer values
        await testInvalidField({ field, invalidValue: 'notAnInteger', endpoint, basePayload });
        await testInvalidField({ field, invalidValue: 3.14, endpoint, basePayload }); // Float instead of integer
 
        if (typeof min === 'number') {
          await testInvalidField({ field, invalidValue: min - 1, endpoint, basePayload });
        }
 
        if (typeof max === 'number') {
          await testInvalidField({ field, invalidValue: max + 1, endpoint, basePayload });
        }
      }
 
      // Helper function to test number field validation  
      async function validateNumber({ field, endpoint, basePayload, required = true, min = null, max = null }) {
        if (required) {
          // Test missing required field
          const payloadWithoutField = { ...basePayload };
          delete payloadWithoutField[field];
          const res = await chai.request(app).post(endpoint).send(payloadWithoutField);
          expect(res).to.have.status(400);
        }
 
        // Test non-number values
        await testInvalidField({ field, invalidValue: 'notANumber', endpoint, basePayload });
 
        if (typeof min === 'number') {
          await testInvalidField({ field, invalidValue: min - 1, endpoint, basePayload });
        }
 
        if (typeof max === 'number') {
          await testInvalidField({ field, invalidValue: max + 1, endpoint, basePayload });
        }
      }
 
      // Helper function to test boolean field validation
      async function validateBool({ field, endpoint, basePayload, required = true }) {
        if (required) {
          // Test missing required field
          const payloadWithoutField = { ...basePayload };
          delete payloadWithoutField[field];
          const res = await chai.request(app).post(endpoint).send(payloadWithoutField);
          expect(res).to.have.status(400);
        }
 
        // Test non-boolean values
        await testInvalidField({ field, invalidValue: 'notABool', endpoint, basePayload });
        await testInvalidField({ field, invalidValue: 1, endpoint, basePayload });
        await testInvalidField({ field, invalidValue: 0, endpoint, basePayload });
      }
 
      // Helper function to test string field validation
      async function validateString({ field, endpoint, basePayload, required = false, minLength = 0, maxLength = 1000 }) {
        if (required) {
          // Test missing required field
          const payloadWithoutField = { ...basePayload };
          delete payloadWithoutField[field];
          const res = await chai.request(app).post(endpoint).send(payloadWithoutField);
          expect(res).to.have.status(400);
        }
 
        // Test non-string values
        await testInvalidField({ field, invalidValue: 123, endpoint, basePayload });
        await testInvalidField({ field, invalidValue: true, endpoint, basePayload });
 
        if (minLength > 0) {
          await testInvalidField({ field, invalidValue: '', endpoint, basePayload });
        }
 
        // Test string too long (malicious attack prevention)
        await testInvalidField({ field, invalidValue: 'x'.repeat(maxLength + 1), endpoint, basePayload });
      }
 
      mocha.describe('Conversions Parameter Validation', () => {
        mocha.beforeEach(async () => {
          const conn = testDB.getConnection();
          // Setup test data if needed
        });
 
        mocha.describe('/edit endpoint', () => {
          const basePayload = {
            sourceId: 1,
            destinationId: 2,
            bidirectional: true,
            slope: 1.5,
            intercept: 0.0,
            note: 'Test conversion note'
          };
 
          mocha.it('should validate integer fields', async () => {
            await validateInt({
              field: 'sourceId',
              endpoint: EDIT_CONVERSION,
              basePayload,
              required: true,
              min: 1 // Must be positive (foreign key constraint)
            });
 
            await validateInt({
              field: 'destinationId',
              endpoint: EDIT_CONVERSION,
              basePayload,
              required: true,
              min: 1 // Must be positive (foreign key constraint)
            });
          });
 
          mocha.it('should validate number fields', async () => {
            await validateNumber({
              field: 'slope',
              endpoint: EDIT_CONVERSION,
              basePayload,
              required: true
            });
 
            await validateNumber({
              field: 'intercept',
              endpoint: EDIT_CONVERSION,
              basePayload,
              required: true
            });
          });
 
          mocha.it('should validate boolean fields', async () => {
            await validateBool({
              field: 'bidirectional',
              endpoint: EDIT_CONVERSION,
              basePayload,
              required: true
            });
          });
 
          mocha.it('should validate string fields', async () => {
            await validateString({
              field: 'note',
              endpoint: EDIT_CONVERSION,
              basePayload,
              required: false, // note is optional
              maxLength: 1000 // Security limit
            });
          });
 
          mocha.it('should reject extra parameters (security)', async () => {
            const payloadWithExtra = {
              ...basePayload,
              extraParam: 'malicious',
              anotherExtra: 'attack'
            };
 
            const res = await chai.request(app)
              .post(EDIT_CONVERSION)
              .send(payloadWithExtra);
            expect(res).to.have.status(400);
          });
        });
 
        mocha.describe('/addConversion endpoint', () => {
          const basePayload = {
            sourceId: 1,
            destinationId: 2,
            bidirectional: false,
            slope: 2.5,
            intercept: 10.0,
            note: null // Test nullable field
          };
 
          mocha.it('should validate integer fields', async () => {
            await validateInt({
              field: 'sourceId',
              endpoint: ADD_CONVERSION,
              basePayload,
              required: true,
              min: 1
            });
 
            await validateInt({
              field: 'destinationId',
              endpoint: ADD_CONVERSION,
              basePayload,
              required: true,
              min: 1
            });
          });
 
          mocha.it('should validate number fields', async () => {
            await validateNumber({
              field: 'slope',
              endpoint: ADD_CONVERSION,
              basePayload,
              required: true
            });
 
            await validateNumber({
              field: 'intercept',
              endpoint: ADD_CONVERSION,
              basePayload,
              required: true
            });
          });
 
          mocha.it('should validate boolean fields', async () => {
            await validateBool({
              field: 'bidirectional',
              endpoint: ADD_CONVERSION,
              basePayload,
              required: true
            });
          });
 
          mocha.it('should validate nullable string fields', async () => {
            // Test valid null value
            const payloadWithNull = { ...basePayload, note: null };
            const res1 = await chai.request(app)
              .post(ADD_CONVERSION)
              .send(payloadWithNull);
            // Should not fail due to null note (assuming other validation passes)
 
            // Test valid string value
            await validateString({
              field: 'note',
              endpoint: ADD_CONVERSION,
              basePayload: { ...basePayload, note: 'Valid note' },
              required: false,
              maxLength: 1000
            });
          });
 
          mocha.it('should reject extra parameters (security)', async () => {
            const payloadWithExtra = {
              ...basePayload,
              maliciousField: 'injection attempt'
            };
 
            const res = await chai.request(app)
              .post(ADD_CONVERSION)
              .send(payloadWithExtra);
            expect(res).to.have.status(400);
          });
        });
 
        mocha.describe('/delete endpoint', () => {
          const basePayload = {
            sourceId: 1,
            destinationId: 2
          };
 
          mocha.it('should validate integer fields', async () => {
            await validateInt({
              field: 'sourceId',
              endpoint: DELETE_CONVERSION,
              basePayload,
              required: true,
              min: 1
            });
 
            await validateInt({
              field: 'destinationId',
              endpoint: DELETE_CONVERSION,
              basePayload,
              required: true,
              min: 1
            });
          });
 
          mocha.it('should reject extra parameters (security)', async () => {
            const payloadWithExtra = {
              ...basePayload,
              extraField: 'should be rejected',
              anotherExtra: 'security test'
            };
 
            const res = await chai.request(app)
              .post(DELETE_CONVERSION)
              .send(payloadWithExtra);
            expect(res).to.have.status(400);
          });
 
          mocha.it('should require both sourceId and destinationId', async () => {
            // Test missing sourceId
            const res1 = await chai.request(app)
              .post(DELETE_CONVERSION)
              .send({ destinationId: 2 });
            expect(res1).to.have.status(400);
 
            // Test missing destinationId
            const res2 = await chai.request(app)
              .post(DELETE_CONVERSION)
              .send({ sourceId: 1 });
            expect(res2).to.have.status(400);
          });
        });
 
        // Edge case and malicious input tests
        mocha.describe('Security and Edge Cases', () => {
          mocha.it('should prevent malicious large payloads', async () => {
            const maliciousPayload = {
              sourceId: 1,
              destinationId: 2,
              bidirectional: true,
              slope: 1.0,
              intercept: 0.0,
              note: 'x'.repeat(2000) // Exceeds 1000 char limit
            };
 
            const res = await chai.request(app)
              .post(EDIT_CONVERSION)
              .send(maliciousPayload);
            expect(res).to.have.status(400);
          });
 
          mocha.it('should reject extreme numeric values', async () => {
            const basePayload = {
              sourceId: 1,
              destinationId: 2,
              bidirectional: true,
              slope: 1.0,
              intercept: 0.0
            };
 
            // Test extreme values that might cause overflow
            await testInvalidField({
              field: 'sourceId',
              invalidValue: Number.MAX_SAFE_INTEGER + 1,
              endpoint: EDIT_CONVERSION,
              basePayload
            });
          });
        });
      });