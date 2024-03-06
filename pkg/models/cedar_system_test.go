package models

func (m *ModelTestSuite) TestCedarSystemFilterInput() {
	m.Run("test cedar system filter model", func() {
		var input1 *CedarSystemFilterInput
		m.True(input1.Empty())

		var input2 = &CedarSystemFilterInput{}
		m.True(input2.Empty())

		input2.EuaUserID = "hello"
		m.False(input2.Empty())
	})
}
