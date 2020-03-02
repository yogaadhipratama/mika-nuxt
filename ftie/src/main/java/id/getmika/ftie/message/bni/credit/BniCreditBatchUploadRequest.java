package id.getmika.ftie.message.bni.credit;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import id.getmika.ftie.message.DataElement;
import id.getmika.ftie.message.EncodeType;
import id.getmika.ftie.message.bni.BniRequest;

public class BniCreditBatchUploadRequest extends BniRequest {

	public BniCreditBatchUploadRequest() {
		super(320);
	}
		
	@Override
	public void setPan(String pan) {
		super.setPan(pan);
		int len = pan.length();
		tm.getIsomsg().addDE(new DataElement(2, getPan(), len).setL2(EncodeType.BCD).setLnVal(len));
	}
		
	@Override
	public void setProcessingCode(String processingCode) {
		super.setProcessingCode(processingCode);
		this.tm.getIsomsg().addDE(new DataElement(3, getProcessingCode(), 6));
	}
	
	@Override
	public void setAmount(String amount) {
		super.setAmount(amount);
		tm.getIsomsg().addDE(new DataElement(4, getAmount(), 12));	
	}

	@Override
	public void setTransactionDateTime(String transactionDateTime) {
		super.setTransactionDateTime(transactionDateTime);
		ZonedDateTime zdt = getTransactionDateTime();
		int time = zdt.getHour() * 10000 + zdt.getMinute() * 100 + zdt.getSecond();
		int date = zdt.getMonthValue() * 100 + zdt.getDayOfMonth();
		this.tm.getIsomsg().addDE(new DataElement(12, time, 6));
		this.tm.getIsomsg().addDE(new DataElement(13, date, 4));		
	}
	
	@Override
	public void setExpirationDate(String expirationDate) {
		super.setExpirationDate(expirationDate);
		LocalDate ldt = getExpirationDate();
		int de14 = (ldt.getYear() - 2000) * 100 + ldt.getMonthValue();
		tm.getIsomsg().addDE(new DataElement(14, de14, 4));
	}
	
	@Override
	public void setEntryMode(String entryMode) {
		super.setEntryMode(entryMode);
		tm.getIsomsg().addDE(new DataElement(22, getEntryMode(), 3));
	}

	@Override
	public void setAppPan(String appPan) {
		super.setAppPan(appPan);
		this.tm.getIsomsg().addDE(new DataElement(23, getAppPan(), 3));		
	}
	
	@Override
	public void setPosCode(String posCode) {
		super.setPosCode(posCode);
		tm.getIsomsg().addDE(new DataElement(25, getPosCode(), 2));
	}
	
	@Override
	public void setReferenceNumber(String referenceNumber) {
		super.setReferenceNumber(referenceNumber);
		tm.getIsomsg().addDE(new DataElement(37, referenceNumber));
	}
	
	@Override
	public void setApprovalCode(String approvalCode) {
		super.setApprovalCode(approvalCode);
		tm.getIsomsg().addDE(new DataElement(38, approvalCode));
	}
	
	@Override
	public void setResponseCode(String responseCode) {
		super.setResponseCode(responseCode);
		this.tm.getIsomsg().addDE(new DataElement(39, responseCode));
	}
		
	@Override
	public void setEmvData(String emvData) {
		super.setEmvData(emvData);
		tm.getIsomsg().addDE(new DataElement(55, emvData).setPacked(true).setL3(EncodeType.BCD));
	}
	
	public void setPrivateData60(String privateData60) {
		if (privateData60.length() != 44)
			throw new IllegalArgumentException("Must be 44 chars PrivateData60: " + privateData60);
		this.tm.getIsomsg().addDE(new DataElement(60, privateData60).setPacked(true).setL4(EncodeType.BCD).setLnVal(22));
	}
	
	public void setPrivateData62(String privateData62) {
		if (privateData62.length() != 12)
			throw new IllegalArgumentException("Must be 12 chars PrivateData62: " + privateData62);
		tm.getIsomsg().addDE(new DataElement(62, privateData62).setPacked(true).setL4(EncodeType.BCD).setLnVal(6));	
	}
	
}
